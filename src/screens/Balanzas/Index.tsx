import React, { useCallback, useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    View,
} from "react-native";
import { Appbar, IconButton, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AppButton from "../../components/ui/AppButton";
import AppInput from "../../components/ui/AppInput";
import {
    BalanzaItem,
    getStoredActiveBalanzaAddress,
    getStoredBalanzas,
    normalizeBalanza,
    saveStoredActiveBalanzaAddress,
    saveStoredBalanzas,
} from "../../utils/balanzasStorage";

const addressRegex = /^([0-9A-F]{2}:){5}[0-9A-F]{2}$/;
const Snackbar = require("react-native-snackbar");

const resolveActiveAddress = (balanzas: BalanzaItem[], preferredAddress: string | null) => {
    if (preferredAddress && balanzas.some((item) => item.address === preferredAddress)) {
        return preferredAddress;
    }

    return balanzas[0]?.address ?? null;
};

const Index = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState("");
    const [address, setAddress] = useState("");
    const [balanzas, setBalanzas] = useState<BalanzaItem[]>([]);
    const [activeAddress, setActiveAddress] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingAddress, setDeletingAddress] = useState<string | null>(null);

    const loadBalanzas = useCallback(async () => {
        setLoading(true);

        try {
            const [storedBalanzas, storedActiveAddress] = await Promise.all([
                getStoredBalanzas(),
                getStoredActiveBalanzaAddress(),
            ]);

            const nextActiveAddress = resolveActiveAddress(storedBalanzas, storedActiveAddress);

            setBalanzas(storedBalanzas);
            setActiveAddress(nextActiveAddress);

            if (nextActiveAddress !== storedActiveAddress) {
                await saveStoredActiveBalanzaAddress(nextActiveAddress);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadBalanzas();
    }, [loadBalanzas]);

    const openModal = useCallback(() => {
        setModalVisible(true);
    }, []);

    const closeModal = useCallback(() => {
        setModalVisible(false);
        setTitle("");
        setAddress("");
    }, []);

    const selectActive = useCallback(
        async (nextAddress: string) => {
            if (nextAddress === activeAddress) {
                return;
            }

            await saveStoredActiveBalanzaAddress(nextAddress);
            setActiveAddress(nextAddress);
        },
        [activeAddress],
    );

    const saveBalanza = useCallback(async () => {
        const normalized = normalizeBalanza({ title, address });

        if (!normalized.title || !normalized.address) {
            Snackbar.show({
                text: "Completa título y address.",
                duration: Snackbar.LENGTH_SHORT,
            });
            return;
        }

        if (!addressRegex.test(normalized.address)) {
            Snackbar.show({
                text: "El address debe tener formato MAC.",
                duration: Snackbar.LENGTH_SHORT,
            });
            return;
        }

        if (balanzas.some((item) => item.address === normalized.address)) {
            Snackbar.show({
                text: "Ya existe una balanza con ese address.",
                duration: Snackbar.LENGTH_SHORT,
            });
            return;
        }

        setSaving(true);

        try {
            const nextBalanzas = [...balanzas, normalized];
            const nextActiveAddress = resolveActiveAddress(nextBalanzas, activeAddress ?? normalized.address);

            await saveStoredBalanzas(nextBalanzas);
            await saveStoredActiveBalanzaAddress(nextActiveAddress);

            setBalanzas(nextBalanzas);
            setActiveAddress(nextActiveAddress);
            closeModal();
        } finally {
            setSaving(false);
        }
    }, [activeAddress, address, balanzas, closeModal, title]);

    const deleteBalanza = useCallback(
        async (item: BalanzaItem) => {
            const nextBalanzas = balanzas.filter((balanza) => balanza.address !== item.address);
            const nextActiveAddress = resolveActiveAddress(
                nextBalanzas,
                activeAddress === item.address ? null : activeAddress,
            );

            setDeletingAddress(item.address);

            try {
                await saveStoredBalanzas(nextBalanzas);
                await saveStoredActiveBalanzaAddress(nextActiveAddress);

                setBalanzas(nextBalanzas);
                setActiveAddress(nextActiveAddress);
            } finally {
                setDeletingAddress(null);
            }
        },
        [activeAddress, balanzas],
    );

    const confirmDelete = useCallback(
        (item: BalanzaItem) => {
            Alert.alert("Eliminar balanza", `¿Eliminar ${item.title}?`, [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: () => {
                        deleteBalanza(item);
                    },
                },
            ]);
        },
        [deleteBalanza],
    );

    return (
        <View style={[styles.screen, { paddingTop: insets.top }]}>
            <Appbar.Header style={styles.appbar} elevated={false}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Balanzas" />
            </Appbar.Header>

            <View style={styles.toolbar}>
                <View style={styles.toolbarText}>
                    <Text style={styles.toolbarTitle}>Balanzas guardadas</Text>
                    <Text style={styles.toolbarSubtitle}>
                        Toca una fila para marcarla como activa.
                    </Text>
                </View>

                <AppButton compact icon="plus" onPress={openModal}>
                    Nuevo
                </AppButton>
            </View>

            <FlatList
                data={balanzas}
                keyExtractor={(item) => item.address}
                contentContainerStyle={[styles.listContent, { paddingBottom: 24 + insets.bottom }]}
                showsVerticalScrollIndicator={false}
                refreshing={loading}
                onRefresh={loadBalanzas}
                ListEmptyComponent={
                    loading ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>Cargando balanzas...</Text>
                        </View>
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyTitle}>Sin balanzas</Text>
                            <Text style={styles.emptyText}>
                                Crea una nueva balanza para empezar a usar Bluetooth.
                            </Text>
                        </View>
                    )
                }
                renderItem={({ item }) => {
                    const isActive = item.address === activeAddress;
                    const isDeleting = deletingAddress === item.address;

                    return (
                        <Pressable
                            onPress={() => selectActive(item.address)}
                            style={({ pressed }) => [
                                styles.row,
                                isActive && styles.rowActive,
                                pressed && styles.rowPressed,
                            ]}
                        >
                            <View style={styles.rowMain}>
                                <View style={[styles.activeMark, isActive && styles.activeMarkOn]} />
                                <View style={styles.rowText}>
                                    <View style={styles.rowTitleLine}>
                                        <Text style={styles.rowTitle}>{item.title}</Text>
                                        {isActive ? <Text style={styles.activeBadge}>Activa</Text> : null}
                                    </View>
                                    <Text style={styles.rowAddress}>{item.address}</Text>
                                </View>
                            </View>

                            <Pressable
                                onPress={(event) => {
                                    event.stopPropagation();
                                    confirmDelete(item);
                                }}
                                hitSlop={10}
                                style={styles.deleteAction}
                            >
                                <IconButton
                                    icon="delete-outline"
                                    loading={isDeleting}
                                    size={20}
                                    disabled={isDeleting}
                                    iconColor="#EF4444"
                                    style={styles.deleteIcon}
                                />
                            </Pressable>
                        </Pressable>
                    );
                }}
            />

            <Modal
                transparent
                visible={modalVisible}
                animationType="fade"
                onRequestClose={closeModal}
            >
                <Pressable style={styles.backdrop} onPress={closeModal}>
                    <Pressable
                        style={[styles.sheet, { paddingBottom: 16 + insets.bottom }]}
                        onPress={(event) => event.stopPropagation()}
                    >
                        <View style={styles.sheetHandle} />
                        <Text style={styles.sheetTitle}>Nueva balanza</Text>
                        <Text style={styles.sheetSubtitle}>
                            Guarda el título y el address que vas a usar en Bluetooth.
                        </Text>

                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : undefined}
                        >
                            <View style={styles.form}>
                                <AppInput
                                    label="Título"
                                    value={title}
                                    onChangeText={setTitle}
                                    placeholder="Balanza principal"
                                />
                                <AppInput
                                    label="Address"
                                    value={address}
                                    onChangeText={(value) => setAddress(value.toUpperCase())}
                                    placeholder="00:08:F4:02:BC:F9"
                                    autoCapitalize="characters"
                                    autoCorrect={false}
                                />

                                <View style={styles.sheetActions}>
                                    <AppButton compact variant="secondary" onPress={closeModal}>
                                        Cancelar
                                    </AppButton>
                                    <AppButton compact onPress={saveBalanza} loading={saving} disabled={saving}>
                                        Guardar
                                    </AppButton>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#F4F6F9",
    },
    appbar: {
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(17, 24, 39, 0.06)",
        elevation: 0,
    },
    toolbar: {
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    toolbarText: {
        flex: 1,
    },
    toolbarTitle: {
        color: "#111827",
        fontSize: 16,
        fontWeight: "800",
    },
    toolbarSubtitle: {
        color: "#6B7280",
        fontSize: 12,
        marginTop: 4,
        lineHeight: 16,
    },
    listContent: {
        paddingHorizontal: 12,
        gap: 10,
    },
    emptyState: {
        paddingHorizontal: 12,
        paddingVertical: 28,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyTitle: {
        color: "#111827",
        fontSize: 15,
        fontWeight: "800",
    },
    emptyText: {
        color: "#6B7280",
        fontSize: 13,
        textAlign: "center",
        lineHeight: 18,
        marginTop: 6,
    },
    row: {
        minHeight: 68,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(17, 24, 39, 0.08)",
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    rowPressed: {
        opacity: 0.9,
    },
    rowActive: {
        backgroundColor: "rgba(59, 130, 246, 0.08)",
        borderColor: "rgba(59, 130, 246, 0.35)",
    },
    rowMain: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    activeMark: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: "#CBD5E1",
    },
    activeMarkOn: {
        backgroundColor: "#2563EB",
    },
    rowText: {
        flex: 1,
    },
    rowTitleLine: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap",
    },
    rowTitle: {
        color: "#111827",
        fontSize: 15,
        fontWeight: "700",
    },
    activeBadge: {
        color: "#2563EB",
        fontSize: 11,
        fontWeight: "800",
        textTransform: "uppercase",
        letterSpacing: 0.6,
    },
    rowAddress: {
        color: "#6B7280",
        fontSize: 12,
        marginTop: 4,
        letterSpacing: 0.2,
    },
    deleteAction: {
        marginLeft: -4,
    },
    deleteIcon: {
        margin: 0,
    },
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(15, 23, 42, 0.45)",
        justifyContent: "flex-end",
    },
    sheet: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    sheetHandle: {
        alignSelf: "center",
        width: 42,
        height: 4,
        borderRadius: 999,
        backgroundColor: "rgba(148, 163, 184, 0.55)",
        marginBottom: 14,
    },
    sheetTitle: {
        color: "#111827",
        fontSize: 18,
        fontWeight: "800",
    },
    sheetSubtitle: {
        color: "#6B7280",
        fontSize: 13,
        lineHeight: 18,
        marginTop: 6,
        marginBottom: 16,
    },
    form: {
        gap: 12,
    },
    sheetActions: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "center",
        gap: 10,
        marginTop: 4,
    },
});

export default Index;

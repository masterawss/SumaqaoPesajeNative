import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProgressBar } from "@react-native-community/progress-bar-android";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { TicketContext } from "./provider/TicketProvider";
import AppIconButton from "../../../components/ui/AppIconButton";

const Header = () => {
    const navigation = useNavigation();
    const { loadingSimple, loadTicket, ticketPesaje, deleteTicket, saveTicket } = useContext(TicketContext) as any;
    const [visibleMenu, setVisibleMenu] = React.useState(false);
    const saveHalo = React.useRef(new Animated.Value(0)).current;
    const isSaved = ticketPesaje?.is_saved === true || Number(ticketPesaje?.is_saved) === 1;
    const showSaveAction = Boolean(ticketPesaje) && !isSaved;

    useEffect(() => {
        const syncResetTicket = async () => {
            const resetTicket = await AsyncStorage.getItem("resetTicket");
            if (resetTicket === "1") {
                loadTicket();
                await AsyncStorage.setItem("resetTicket", "0");
            }
        };

        syncResetTicket();
    }, [loadTicket]);

    useEffect(() => {
        if (!showSaveAction) {
            saveHalo.stopAnimation();
            saveHalo.setValue(0);
            return;
        }

        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(saveHalo, {
                    toValue: 1,
                    duration: 1200,
                    useNativeDriver: true,
                }),
                Animated.timing(saveHalo, {
                    toValue: 0,
                    duration: 1200,
                    useNativeDriver: true,
                }),
            ])
        );

        animation.start();

        return () => {
            animation.stop();
        };
    }, [saveHalo, showSaveAction]);

    return (
        <>
            <View style={styles.header}>
                <View style={styles.left}>
                    <AppIconButton icon="chevron-left" onPress={() => navigation.goBack()} style={styles.headerAction} />
                    <View>
                        <Text style={styles.title}>Ticket de pesaje</Text>
                        <Text style={styles.subtitle}>
                            {ticketPesaje?.codigo ?? "Detalle del ticket"}
                        </Text>
                    </View>
                </View>

                <View style={styles.actions}>
                    {showSaveAction ? (
                        <View style={styles.saveActionWrap}>
                            <Animated.View
                                pointerEvents="none"
                                style={[
                                    styles.saveHalo,
                                    {
                                        opacity: saveHalo.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0.18, 0.42],
                                        }),
                                        transform: [
                                            {
                                                scale: saveHalo.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [1, 1.42],
                                                }),
                                            },
                                        ],
                                    },
                                ]}
                            />
                            <AppIconButton
                                icon="content-save-outline"
                                variant="soft"
                                style={[styles.headerAction, styles.saveAction]}
                                onPress={() => {
                                    setVisibleMenu(false);
                                    saveTicket();
                                }}
                            />
                        </View>
                    ) : null}

                    <View>
                        <AppIconButton
                            icon="dots-vertical"
                            variant="soft"
                            style={styles.headerAction}
                            onPress={() => setVisibleMenu((current) => !current)}
                        />
                        {visibleMenu ? (
                            <Pressable style={styles.menuBackdrop} onPress={() => setVisibleMenu(false)}>
                                <Pressable style={styles.menu} onPress={(event) => event.stopPropagation()}>
                                    <Pressable
                                        style={styles.menuItem}
                                        onPress={() => {
                                            setVisibleMenu(false);
                                            loadTicket();
                                        }}
                                    >
                                        <MaterialCommunityIcons name="refresh" size={18} color="#111827" />
                                        <Text style={styles.menuText}>Recargar</Text>
                                    </Pressable>
                                    <View style={styles.divider} />
                                    <Pressable
                                        style={styles.menuItem}
                                        onPress={() => {
                                            setVisibleMenu(false);
                                            deleteTicket();
                                        }}
                                    >
                                        <MaterialCommunityIcons name="delete-outline" size={18} color="#DC2626" />
                                        <Text style={[styles.menuText, styles.menuTextDanger]}>Eliminar</Text>
                                    </Pressable>
                                </Pressable>
                            </Pressable>
                        ) : null}
                    </View>
                </View>
            </View>
            {loadingSimple ? <ProgressBar styleAttr="Horizontal" color="#111827" /> : null}
        </>
    );
};

const styles = StyleSheet.create({
    header: {
        minHeight: 68,
        backgroundColor: "rgba(255, 255, 255, 0.74)",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(148, 163, 184, 0.18)",
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 5,
        shadowColor: "#94A3B8",
        shadowOpacity: 0.08,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 8 },
        elevation: 4,
    },
    left: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        flex: 1,
    },
    actions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    saveActionWrap: {
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
    },
    saveHalo: {
        position: "absolute",
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "rgba(96, 165, 250, 0.2)",
        borderWidth: 1,
        borderColor: "rgba(96, 165, 250, 0.34)",
    },
    headerAction: {
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.58)",
    },
    saveAction: {
        borderColor: "rgba(147, 197, 253, 0.72)",
    },
    title: {
        color: "#111827",
        fontSize: 18,
        fontWeight: "800",
    },
    subtitle: {
        color: "#6B7280",
        fontSize: 12,
        marginTop: 2,
    },
    menuBackdrop: {
        position: "absolute",
        top: 42,
        right: 0,
        left: -400,
        bottom: -1000,
    },
    menu: {
        position: "absolute",
        top: 8,
        right: 0,
        width: 188,
        backgroundColor: "rgba(255, 255, 255, 0.94)",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(203, 213, 225, 0.86)",
        paddingVertical: 6,
        shadowColor: "#64748B",
        shadowOpacity: 0.14,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 10,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    menuText: {
        color: "#111827",
        fontSize: 14,
        fontWeight: "600",
    },
    menuTextDanger: {
        color: "#DC2626",
    },
    divider: {
        height: 1,
        backgroundColor: "#E5E7EB",
        marginHorizontal: 10,
    },
});

export default Header;

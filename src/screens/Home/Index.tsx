import React, { useCallback, useState } from "react";
import { View, StyleSheet, Image, StatusBar, Text, Pressable, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LinearGradient from "react-native-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import List from "./List";
import BtnCreate from "./components/BtnCreate";
import AppTabChip from "../../components/ui/AppTabChip";
import AppIconButton from "../../components/ui/AppIconButton";

const LogoImg = require("../../../assets/img/logo.png");

const Index = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const [type, setType] = useState<"ingreso" | "exportacion">("ingreso");
    const [visibleMenu, setVisibleMenu] = useState(false);

    const logout = useCallback(async () => {
        setVisibleMenu(false);
        await AsyncStorage.removeItem("user");
        navigation.replace("login");
    }, [navigation]);

    const goToBalanzas = useCallback(() => {
        setVisibleMenu(false);
        navigation.navigate("balanzas");
    }, [navigation]);

    return (
        <View style={[styles.safeArea, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" backgroundColor="#F4F6F9" />
            <LinearGradient colors={["#F4F6F9", "#FFFFFF"]} style={styles.background}>
                <View style={styles.appbar}>
                    <View style={styles.appbarLeft}>
                        <Image source={LogoImg} style={styles.logo} resizeMode="contain" />
                        <Text style={styles.appbarTitle}>Tickets de pesaje</Text>
                    </View>
                    <View style={styles.appbarActions}>
                        <BtnCreate type={type} />
                        <AppIconButton
                            icon="account-circle-outline"
                            size={22}
                            variant="soft"
                            onPress={() => setVisibleMenu((current) => !current)}
                            style={styles.accountButton}
                        />
                    </View>
                </View>
                <Modal transparent visible={visibleMenu} animationType="fade" onRequestClose={() => setVisibleMenu(false)}>
                    <Pressable style={styles.menuBackdrop} onPress={() => setVisibleMenu(false)}>
                        <Pressable style={styles.menu} onPress={(event) => event.stopPropagation()}>
                            <Pressable style={styles.menuItem} onPress={goToBalanzas}>
                                <MaterialCommunityIcons name="scale-bathroom" size={18} color="#111827" />
                                <Text style={styles.menuText}>Balanzas</Text>
                            </Pressable>
                            <Pressable style={styles.menuItem} onPress={logout}>
                                <MaterialCommunityIcons name="logout" size={18} color="#111827" />
                                <Text style={styles.menuText}>Cerrar sesión</Text>
                            </Pressable>
                        </Pressable>
                    </Pressable>
                </Modal>

                <View style={styles.shell}>
                    <View style={styles.tabsRow}>
                        <AppTabChip
                            label="Ingresos"
                            icon="login"
                            active={type === "ingreso"}
                            onPress={() => setType("ingreso")}
                        />
                        <AppTabChip
                            label="Exportación"
                            icon="logout"
                            active={type === "exportacion"}
                            onPress={() => setType("exportacion")}
                        />
                    </View>

                    <View style={styles.listContainer}>
                        <List navigation={navigation} type={type} />
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F4F6F9",
    },
    background: {
        flex: 1,
    },
    appbar: {
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(17, 24, 39, 0.06)",
        minHeight: 64,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    appbarLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    appbarActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    appbarTitle: {
        color: "#111827",
        fontSize: 18,
        fontWeight: "800",
        marginLeft: 4,
    },
    logo: {
        width: 28,
        height: 28,
    },
    accountButton: {
        marginLeft: 2,
    },
    menuBackdrop: {
        flex: 1,
        backgroundColor: "rgba(15, 23, 42, 0.18)",
    },
    menu: {
        position: "absolute",
        top: 74,
        right: 12,
        width: 180,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        paddingVertical: 6,
        elevation: 12,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
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
    shell: {
        flex: 1,
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 10,
    },
    tabsRow: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 12,
    },
    listContainer: {
        flex: 1,
        minHeight: 0,
    },
});

export default Index;

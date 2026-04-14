import React, { useCallback, useState } from "react";
import { View, StyleSheet, Image, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LinearGradient from "react-native-linear-gradient";
import { Appbar, Menu, IconButton } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import List from "./List";
import BtnCreate from "./components/BtnCreate";
import AppTabChip from "../../components/ui/AppTabChip";

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
                <Appbar.Header style={styles.appbar} elevated={false}>
                    <Image source={LogoImg} style={styles.logo} resizeMode="contain" />
                    <Appbar.Content title="Tickets de pesaje" />
                    <BtnCreate type={type} />
                    <Menu
                        visible={visibleMenu}
                        onDismiss={() => setVisibleMenu(false)}
                        anchor={
                            <IconButton
                                icon="account-circle-outline"
                                size={22}
                                iconColor="#111827"
                                onPress={() => setVisibleMenu(true)}
                                style={styles.accountButton}
                            />
                        }
                    >
                        <Menu.Item onPress={goToBalanzas} title="Balanzas" />
                        <Menu.Item onPress={logout} title="Cerrar sesión" />
                    </Menu>
                </Appbar.Header>

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
        elevation: 0,
    },
    logo: {
        width: 28,
        height: 28,
        marginLeft: 12,
        marginRight: 4,
    },
    accountButton: {
        margin: 0,
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

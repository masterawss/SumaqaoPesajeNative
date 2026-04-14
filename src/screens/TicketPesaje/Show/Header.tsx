import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProgressBar } from "@react-native-community/progress-bar-android";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { TicketContext } from "./provider/TicketProvider";
import AppIconButton from "../../../components/ui/AppIconButton";

const Header = () => {
    const navigation = useNavigation();
    const { loadingSimple, loadTicket, ticketPesaje, deleteTicket, saveTicket } = useContext(TicketContext) as any;
    const [visibleMenu, setVisibleMenu] = React.useState(false);

    const haveToResetTicket = async () => {
        const resetTicket = await AsyncStorage.getItem("resetTicket");
        if (resetTicket == "1") {
            loadTicket();
            await AsyncStorage.setItem("resetTicket", "0");
        }
    };

    useEffect(() => {
        haveToResetTicket();
    }, []);

    return (
        <>
            <View style={styles.header}>
                <View style={styles.left}>
                    <AppIconButton icon="chevron-left" onPress={() => navigation.goBack()} />
                    <View>
                        <Text style={styles.title}>Ticket de pesaje</Text>
                        <Text style={styles.subtitle}>
                            {ticketPesaje?.codigo ?? "Detalle del ticket"}
                        </Text>
                    </View>
                </View>

                <View>
                    <AppIconButton
                        icon="dots-vertical"
                        variant="soft"
                        onPress={() => setVisibleMenu((current) => !current)}
                    />
                    {visibleMenu ? (
                        <Pressable style={styles.menuBackdrop} onPress={() => setVisibleMenu(false)}>
                            <Pressable style={styles.menu} onPress={(event) => event.stopPropagation()}>
                                {!ticketPesaje?.is_saved ? (
                                    <Pressable
                                        style={styles.menuItem}
                                        onPress={() => {
                                            setVisibleMenu(false);
                                            saveTicket();
                                        }}
                                    >
                                        <MaterialCommunityIcons name="content-save-outline" size={18} color="#111827" />
                                        <Text style={styles.menuText}>Guardar</Text>
                                    </Pressable>
                                ) : null}
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
            {loadingSimple ? <ProgressBar styleAttr="Horizontal" color="#111827" /> : null}
        </>
    );
};

const styles = StyleSheet.create({
    header: {
        minHeight: 68,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 5,
    },
    left: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        flex: 1,
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
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        paddingVertical: 6,
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

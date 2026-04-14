import React, { useContext, useMemo } from "react";
import { ActivityIndicator, StyleSheet, Switch, Text, View } from "react-native";

import { TicketContext } from "../../Show/provider/TicketProvider";
import ManualSection from "./TaraSection/ManualSection";
import BluetoothSection from "./TaraSection/BluetoothSection";
import { BalanzaBluetoothContext } from "../../context/BalanzaBluetoothProvider";
import AppSurface from "../../../../components/ui/AppSurface";
import AppIconButton from "../../../../components/ui/AppIconButton";
import AppModalSheet from "../../../../components/ui/AppModalSheet";

const TaraSection = () => {
    const [visible, setVisible] = React.useState(false);
    const {
        loading,
        loadTicket,
        ticketPesaje,
        hasError,
        currentGuiaRemision,
        hasGuiasRemision,
        setCurrentGuiaRemision,
        setNextGuiaRemision
    } = useContext(TicketContext) as any;
    const [isBluetooth, setIsBluetooth] = React.useState(false);
    const {bluetoothEnabled, loading: loadingBluetooh, device, peso, connectToDevice, checkBluetoothEnabled} = useContext(BalanzaBluetoothContext);

    const peso_solo_paletas = useMemo(() => {
        if(currentGuiaRemision){
            return currentGuiaRemision.ticket_pesaje_tara ?? 0
        }
        return ticketPesaje?.peso_solo_paletas
    }, [ticketPesaje?.peso_solo_paletas, currentGuiaRemision])

    const isEdit = useMemo(() => {
        return parseFloat(peso_solo_paletas) > 0
    }, [peso_solo_paletas])

    return (
        <>
            <AppSurface style={styles.card}>
                {loading ? (
                    <View style={styles.stateRow}>
                        <ActivityIndicator size="small" color="#111827" />
                        <Text style={styles.stateText}>Cargando...</Text>
                    </View>
                ) : null}
                {hasError ? (
                    <View style={styles.errorRow}>
                        <Text style={styles.stateText}>Ha ocurrido un error</Text>
                        <AppIconButton icon="refresh" color="#6B7280" size={20} onPress={loadTicket} />
                    </View>
                ) : null}
                {!loading && !hasError ? (
                    <>
                        {!hasGuiasRemision ? (
                            <View style={styles.singleRow}>
                                <Text style={styles.singleLabel}>Tara en paletas</Text>
                                <View style={styles.singleValueWrap}>
                                    {Number(peso_solo_paletas) > 0 ? (
                                        <>
                                            <Text style={styles.singleValue}>{peso_solo_paletas}</Text>
                                            <Text style={styles.singleUnit}>Kg</Text>
                                        </>
                                    ) : (
                                        <View style={styles.warningBadge}>
                                            <Text style={styles.warningBadgeText}>Sin registro</Text>
                                        </View>
                                    )}
                                    <AppIconButton icon="pencil" variant="soft" color="#6B7280" size={18} onPress={() => setVisible(true)} />
                                </View>
                            </View>
                        ) : null}
                        {hasGuiasRemision ? (
                            <View style={styles.header}>
                                <View style={styles.headerText}>
                                    <Text style={styles.title}>Taras</Text>
                                </View>
                                <AppIconButton icon="pencil" variant="soft" color="#6B7280" size={20} onPress={() => setVisible(true)} />
                            </View>
                        ) : null}
                        {hasGuiasRemision ? (
                            <View style={styles.list}>
                                {ticketPesaje?.guias_remision?.map((guia: any, index: number) => (
                                    <View key={index} style={styles.listItem}>
                                        <Text style={styles.listCode}>{guia.codigo}</Text>
                                        <Text style={styles.listValue}>{guia.ticket_pesaje_tara} Kg</Text>
                                    </View>
                                ))}
                            </View>
                        ) : null}
                    </>
                ) : null}
            </AppSurface>

            <AppModalSheet
                visible={visible}
                onClose={() => setVisible(false)}
                title="Tara en paletas"
                subtitle="Selecciona el modo de captura y registra la tara."
            >
                <View style={styles.sheetToggle}>
                    <Text style={styles.switchLabel}>{isBluetooth ? 'Bluetooth' : 'Manual'}</Text>
                    <Switch value={isBluetooth} onValueChange={() => setIsBluetooth(val => !val)} trackColor={{ false: "#D1D5DB", true: "#111827" }} thumbColor="#FFFFFF" />
                </View>
                {isBluetooth ? (
                    <BluetoothSection
                        guiasRemision={ticketPesaje?.guias_remision}
                        peso_solo_paletas={peso_solo_paletas}
                        ticketPesaje={ticketPesaje}
                        loadTicket={loadTicket}
                        setVisible={setVisible}
                        bluetoothEnabled={bluetoothEnabled}
                        loading={loadingBluetooh}
                        device={device}
                        peso={peso}
                        connectToDevice={connectToDevice}
                        checkBluetoothEnabled={checkBluetoothEnabled}
                        isEdit={isEdit}
                        currentGuiaRemision={currentGuiaRemision}
                        hasGuiasRemision={hasGuiasRemision}
                        setCurrentGuiaRemision={setCurrentGuiaRemision}
                        setNextGuiaRemision={setNextGuiaRemision}
                    />
                ) : (
                    <ManualSection
                        isEdit={isEdit}
                        setVisible={setVisible}
                        ticketPesaje={ticketPesaje}
                        loadTicket={loadTicket}
                        guiasRemision={ticketPesaje?.guias_remision}
                        peso_solo_paletas={peso_solo_paletas}
                        currentGuiaRemision={currentGuiaRemision}
                        hasGuiasRemision={hasGuiasRemision}
                        setCurrentGuiaRemision={setCurrentGuiaRemision}
                        setNextGuiaRemision={setNextGuiaRemision}
                    />
                )}
            </AppModalSheet>
        </>
    )
}

const styles = StyleSheet.create({
    card: {
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    stateRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    errorRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    stateText: {
        color: "#6B7280",
        fontSize: 14,
        fontWeight: "600",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 8,
    },
    headerText: {
        flex: 1,
        minWidth: 0,
    },
    title: {
        color: "#111827",
        fontSize: 14,
        fontWeight: "800",
    },
    singleRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        minHeight: 34,
    },
    singleLabel: {
        color: "#6B7280",
        fontSize: 11,
        fontWeight: "700",
        textTransform: "uppercase",
        flexShrink: 1,
    },
    singleValueWrap: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 6,
        flexShrink: 0,
    },
    singleValue: {
        color: "#111827",
        fontSize: 18,
        fontWeight: "800",
        lineHeight: 20,
    },
    singleUnit: {
        color: "#6B7280",
        fontSize: 11,
        fontWeight: "700",
        marginRight: 2,
    },
    warningBadge: {
        backgroundColor: "#FEF3C7",
        borderRadius: 999,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    warningBadgeText: {
        color: "#92400E",
        fontSize: 11,
        fontWeight: "700",
    },
    list: {
        marginTop: 6,
        gap: 4,
    },
    listItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    listCode: {
        color: "#111827",
        fontSize: 12,
        fontWeight: "700",
    },
    listValue: {
        color: "#374151",
        fontSize: 12,
    },
    sheetToggle: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    switchLabel: {
        color: "#6B7280",
        fontSize: 12,
        fontWeight: "600",
    },
});

export default TaraSection;

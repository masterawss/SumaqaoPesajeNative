import React from "react";
import { Switch, Text, View, StyleSheet } from "react-native";

import BluetoothSection from "./PesajeCreateSection/BluetoothSection";
import ManualSection from "./PesajeCreateSection/ManualSection";
import AppSurface from "../../../../components/ui/AppSurface";

const PesajeCreateSection = () => {
    const [isBluetooth, setIsBluetooth] = React.useState(true);

    return (
        <AppSurface style={styles.card}>
            <View style={styles.header}>
                <View style={styles.headerText}>
                    <Text style={styles.title}>Registro de pesaje</Text>
                    <Text style={styles.subtitle}>Manual o Bluetooth</Text>
                </View>
                <View style={styles.switchWrap}>
                    <Text style={styles.switchLabel}>{isBluetooth ? 'Bluetooth' : 'Manual'}</Text>
                    <Switch value={isBluetooth} onValueChange={() => setIsBluetooth(val => !val)} trackColor={{ false: "#D1D5DB", true: "#111827" }} thumbColor="#FFFFFF" />
                </View>
            </View>
            {isBluetooth ? <BluetoothSection /> : <ManualSection />}
        </AppSurface>
    )
}

const styles = StyleSheet.create({
    card: {
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 8,
        marginBottom: 6,
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
    subtitle: {
        color: "#6B7280",
        fontSize: 11,
        marginTop: 0,
    },
    switchWrap: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    switchLabel: {
        color: "#6B7280",
        fontSize: 11,
        fontWeight: "600",
    },
});

export default PesajeCreateSection;

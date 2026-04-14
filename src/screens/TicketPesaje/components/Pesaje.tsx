import { View, Text, StyleSheet } from "react-native";
import React, { useContext, useMemo } from "react";

import TaraSection from "./Pesaje/TaraSection";
import SimpleCard from "./Pesaje/SimpleCard";
import PesajeCreateSection from "./Pesaje/PesajeCreateSection";
import { TicketContext } from "../Show/provider/TicketProvider";
import BalanzaBluetoothProvider from "../context/BalanzaBluetoothProvider";

const Pesaje = () => {
    const { ticketPesaje } = useContext(TicketContext) as any;

    const ticketPesajeGroup = useMemo(() => {
        const group: any = {};
        ticketPesaje.detalle.forEach((item: any) => {
            const code = item.g_r_cod !== null && item.g_r_cod !== '' ? item.g_r_cod : '()';
            if (!group[code]) {
                group[code] = [];
            }
            group[code].push(item);
        });
        return group
    }, [ticketPesaje.detalle])

    const ticketPesajeGroupKeys = useMemo(() => {
        return Object.keys(ticketPesajeGroup)
    }, [ticketPesajeGroup])

    return (
        <BalanzaBluetoothProvider>
            <View style={styles.container}>
                <TaraSection />
                <PesajeCreateSection />
                <View style={styles.listHeader}>
                    <Text style={styles.title}>Lista de pesaje</Text>
                    <Text style={styles.subtitle}>Registros agrupados por guía.</Text>
                </View>
                {ticketPesajeGroupKeys.map((key) => (
                    <View key={key} style={styles.group}>
                        <Text style={styles.groupTitle}>{key}</Text>
                        {ticketPesajeGroup[key].map((item: any, index: number) => (
                            <SimpleCard key={item.id} nro={index + 1} detalle={item} />
                        ))}
                    </View>
                ))}
            </View>
        </BalanzaBluetoothProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    listHeader: {
        marginTop: 4,
    },
    title: {
        color: "#111827",
        fontSize: 16,
        fontWeight: "800",
    },
    subtitle: {
        color: "#6B7280",
        fontSize: 12,
        marginTop: 2,
    },
    group: {
        gap: 8,
    },
    groupTitle: {
        color: "#6B7280",
        fontSize: 12,
        fontWeight: "800",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
});

export default Pesaje;

import { View, Text, StyleSheet } from "react-native";
import React, { useContext, useMemo } from "react";

import TaraSection from "./Pesaje/TaraSection";
import SimpleCard from "./Pesaje/SimpleCard";
import PesajeCreateSection from "./Pesaje/PesajeCreateSection";
import { TicketContext } from "../Show/provider/TicketProvider";
import BalanzaBluetoothProvider from "../context/BalanzaBluetoothProvider";
import AppDivider from "../../../components/ui/AppDivider";
import AppSurface from "../../../components/ui/AppSurface";

const getDetalleTimestamp = (item: any) => {
    const parsedDate = Date.parse(item?.created_at ?? "");
    if (!Number.isNaN(parsedDate)) {
        return parsedDate;
    }

    return Number(item?.id ?? 0);
};

const Pesaje = () => {
    const { ticketPesaje } = useContext(TicketContext) as any;

    const ticketPesajeGroup = useMemo(() => {
        const group: any = {};
        const detalle = Array.isArray(ticketPesaje?.detalle) ? [...ticketPesaje.detalle] : [];
        detalle.sort((a: any, b: any) => getDetalleTimestamp(b) - getDetalleTimestamp(a));
        detalle.forEach((item: any) => {
            const code = item.g_r_cod !== null && item.g_r_cod !== '' ? item.g_r_cod : '()';
            if (!group[code]) {
                group[code] = [];
            }
            group[code].push(item);
        });
        return group
    }, [ticketPesaje?.detalle])

    const ticketPesajeGroupKeys = useMemo(() => {
        return Object.keys(ticketPesajeGroup).sort((a, b) => {
            const latestA = ticketPesajeGroup[a]?.[0];
            const latestB = ticketPesajeGroup[b]?.[0];

            return getDetalleTimestamp(latestB) - getDetalleTimestamp(latestA);
        })
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
                <AppSurface style={styles.listSurface}>
                    {ticketPesajeGroupKeys.map((key, groupIndex) => (
                        <View key={key}>
                            {groupIndex > 0 ? <AppDivider /> : null}
                            <View style={styles.group}>
                                <Text style={styles.groupTitle}>{key}</Text>
                                {ticketPesajeGroup[key].map((item: any, index: number) => (
                                    <View key={item.id}>
                                        {index > 0 ? <AppDivider style={styles.rowDivider} /> : null}
                                        <SimpleCard nro={index + 1} detalle={item} />
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}
                </AppSurface>
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
    listSurface: {
        overflow: "hidden",
    },
    group: {
        paddingVertical: 8,
    },
    groupTitle: {
        color: "#6B7280",
        fontSize: 12,
        fontWeight: "800",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        paddingHorizontal: 12,
        paddingBottom: 6,
    },
    rowDivider: {
        marginLeft: 48,
    },
});

export default Pesaje;

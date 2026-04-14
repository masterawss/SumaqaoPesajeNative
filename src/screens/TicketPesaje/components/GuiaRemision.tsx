import { Text, View, StyleSheet } from "react-native";
import { useContext } from "react";
import { useNavigation } from "@react-navigation/native";

import SimpleCard from "../../GuiaRemision/components/SimpleCard";
import { TicketContext } from "../Show/provider/TicketProvider";
import { numberFormat } from "../../../utils/numberFormat";
import AppButton from "../../../components/ui/AppButton";
import AppSurface from "../../../components/ui/AppSurface";

const GuiaRemision = () => {
    const { ticketPesaje } = useContext(TicketContext) as any;
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Guías de remisión</Text>
                    <Text style={styles.subtitle}>Relación y métricas del ticket actual</Text>
                </View>
                <AppButton
                    compact
                    onPress={() => navigation.navigate('guia_remision.search', {ticketId: ticketPesaje.id})}
                >
                    Agregar guía
                </AppButton>
            </View>

            <View style={styles.metrics}>
                <AppSurface style={styles.metricCard}>
                    <Text style={styles.metricValue}>{numberFormat(ticketPesaje.total_grr_peso_neto_enviado)} kg</Text>
                    <Text style={styles.metricLabel}>Total peso neto</Text>
                </AppSurface>
                <AppSurface style={styles.metricCard}>
                    <Text style={styles.metricValue}>{numberFormat(ticketPesaje.total_grr_sacos)}</Text>
                    <Text style={styles.metricLabel}>Total de sacos</Text>
                </AppSurface>
            </View>

            {ticketPesaje.guias_remision.map((guia_remision: any) => (
                <SimpleCard key={guia_remision.id} guiaRemision={guia_remision} ticketId={ticketPesaje.id} isInTicket />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
    },
    title: {
        color: "#111827",
        fontSize: 15,
        fontWeight: "800",
    },
    subtitle: {
        color: "#6B7280",
        fontSize: 11,
        marginTop: 0,
    },
    metrics: {
        flexDirection: "row",
        gap: 8,
    },
    metricCard: {
        flex: 1,
        padding: 12,
    },
    metricValue: {
        color: "#111827",
        fontSize: 18,
        fontWeight: "800",
    },
    metricLabel: {
        color: "#6B7280",
        fontSize: 11,
        marginTop: 2,
    },
});

export default GuiaRemision;

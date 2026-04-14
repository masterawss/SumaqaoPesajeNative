import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useContext, useEffect, useState } from "react";

import api from "../../utils/axios";
import { TicketContext } from "../../screens/TicketPesaje/Show/provider/TicketProvider";
import { numberFormat } from "../../utils/numberFormat";
import AppSurface from "../ui/AppSurface";

export interface TicketPesajeSimpleCard {
    id: number;
    codigo: string;
    fecha_desc: string;
    main_image_url: string | null;
    placa_tracto: string | null;
    is_saved: boolean;
    is_exportacion: boolean;
    total_grr_sacos: number;
    total_nro_sacos: number;
    guias_remision_count: number;
    nro_sacos?: number | null;
    saco_color_id?: number | null;
    peso_solo_paletas?: number | null;
}

interface SimpleCardProps {
    id?: number | null;
    ticket?: TicketPesajeSimpleCard | null;
}

const SimpleCard = ({ id = null, ticket = null }: SimpleCardProps) => {
    const ticketContext = useContext(TicketContext) as any;

    const [ticketData, setTicketData] = useState<TicketPesajeSimpleCard | null>(null);
    const [hasError, setHasError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            setLoading(true);
            setHasError(false);

            api.get("/ticket_pesaje/" + id)
                .then((response) => {
                    setTicketData(response.data.ticket_pesaje);
                })
                .catch((error) => {
                    console.log(error.response);
                    setHasError(true);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else if (ticket) {
            setTicketData(ticket);
        } else {
            setTicketData(ticketContext.ticketPesaje ?? null);
        }
    }, [id, ticket, ticketContext.ticketPesaje]);

    const totalSacos = ticketData?.is_exportacion ? ticketData?.total_grr_sacos : ticketData?.total_nro_sacos;
    const grrValue = ticketData?.guias_remision_count ?? 0;
    const taraValue = ticketData?.peso_solo_paletas ?? 0;
    const placaValue = ticketData?.placa_tracto?.trim() ?? "";
    const hasGrr = Number(grrValue) > 0;
    const hasTara = Number(taraValue) > 0;
    const hasPlaca = placaValue.length > 0;

    return (
        <AppSurface style={styles.card}>
            {loading && !hasError ? (
                <View style={styles.stateBox}>
                    <ActivityIndicator size="small" color="#111827" />
                </View>
            ) : null}

            {ticketContext.loading && !ticketContext.hasError ? (
                <View style={styles.stateBox}>
                    <ActivityIndicator size="small" color="#111827" />
                </View>
            ) : null}

            {!ticketContext.loading && !ticketContext.hasError && ticketData ? (
                <View style={styles.content}>
                    <View style={styles.header}>
                        <View style={styles.titleBlock}>
                            <Text style={styles.code}>{ticketData.codigo}</Text>
                            <Text style={styles.date}>{ticketData.fecha_desc}</Text>
                        </View>
                        <View style={[styles.statusChip, ticketData.is_saved ? styles.statusSaved : styles.statusPending]}>
                            <Text style={styles.statusText}>{ticketData.is_saved ? "Guardado" : "Sin guardar"}</Text>
                        </View>
                    </View>

                    <View style={styles.metricsRow}>
                        <View style={styles.metricItem}>
                            <Text style={styles.metricLabel}>GRR</Text>
                            {hasGrr ? (
                                <Text style={styles.metricValue}>{numberFormat(grrValue)}</Text>
                            ) : (
                                <View style={styles.warningBadge}>
                                    <Text style={styles.warningBadgeText}>Sin GRR</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.metricItem}>
                            <Text style={styles.metricLabel}>Sacos</Text>
                            <Text style={styles.metricValue}>{numberFormat(totalSacos ?? 0)}</Text>
                        </View>

                        <View style={styles.metricItem}>
                            <Text style={styles.metricLabel}>Tara</Text>
                            {hasTara ? (
                                <Text style={styles.metricValue}>{numberFormat(taraValue)} Kg</Text>
                            ) : (
                                <View style={styles.warningBadge}>
                                    <Text style={styles.warningBadgeText}>Sin tara</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.metricItem}>
                            <Text style={styles.metricLabel}>Placa</Text>
                            {hasPlaca ? (
                                <Text style={styles.metricValue} numberOfLines={1}>{placaValue}</Text>
                            ) : (
                                <View style={styles.warningBadge}>
                                    <Text style={styles.warningBadgeText}>Sin placa</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            ) : null}
        </AppSurface>
    );
};

    const styles = StyleSheet.create({
    card: {
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    stateBox: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
    },
    content: {
        gap: 8,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
    },
    titleBlock: {
        minWidth: 0,
        flex: 1,
    },
    code: {
        color: "#111827",
        fontSize: 17,
        fontWeight: "800",
        lineHeight: 19,
    },
    date: {
        color: "#9CA3AF",
        fontSize: 12,
        marginTop: 1,
    },
    statusChip: {
        borderRadius: 999,
        paddingHorizontal: 7,
        paddingVertical: 3,
        alignSelf: "flex-start",
    },
    statusSaved: {
        backgroundColor: "#D1FAE5",
    },
    statusPending: {
        backgroundColor: "#FDE68A",
    },
    statusText: {
        color: "#111827",
        fontSize: 10,
        fontWeight: "800",
    },
    metricsRow: {
        flexDirection: "row",
        alignItems: "stretch",
        gap: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
    },
    metricItem: {
        flex: 1,
        minWidth: 0,
        gap: 4,
    },
    metricLabel: {
        color: "#9CA3AF",
        fontSize: 10,
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 0.4,
    },
    metricValue: {
        color: "#111827",
        fontSize: 13,
        fontWeight: "800",
        lineHeight: 16,
    },
    warningBadge: {
        alignSelf: "flex-start",
        backgroundColor: "#FEF3C7",
        borderRadius: 999,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    warningBadgeText: {
        color: "#92400E",
        fontSize: 10,
        fontWeight: "700",
    },
});

export default SimpleCard;

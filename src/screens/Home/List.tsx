import React, { useEffect, useMemo, useCallback, useRef } from "react";
import {
    View,
    ActivityIndicator,
    Text,
    StyleSheet,
    TouchableOpacity,
    Pressable,
    FlatList,
} from "react-native";
import DatePicker from "react-native-date-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import SimpleCard from "../../components/Ticket/SimpleCard";
import ErrorSection from "../../components/ErrorSection";
import api from "../../utils/axios";

const PER_PAGE = 20;

const Index = ({ navigation, type = "ingreso" }: any) => {
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = React.useState(false);
    const [refreshing, setRefreshing] = React.useState(false);
    const [loadingMore, setLoadingMore] = React.useState(false);
    const [tickets, setTickets] = React.useState<any[]>([]);
    const [hasError, setHasError] = React.useState(false);
    const [date, setDate] = React.useState(new Date());
    const [open, setOpen] = React.useState(false);

    const [currentPage, setCurrentPage] = React.useState(1);
    const [lastPage, setLastPage] = React.useState(1);
    const [total, setTotal] = React.useState(0);

    const onEndReachedCalledDuringMomentum = useRef(false);
    const isFetchingRef = useRef(false);
    const isRefreshingRef = useRef(false);
    const isLoadingMoreRef = useRef(false);

    const dateStr = useMemo(() => {
        const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return local.toISOString().slice(0, 10);
    }, [date]);

    const hasMorePages = currentPage < lastPage;

    const fetchTickets = useCallback(
        async ({
            page = 1,
            mode = "initial",
        }: {
            page?: number;
            mode?: "initial" | "refresh" | "append";
        }) => {
            if (mode === "initial") {
                if (isFetchingRef.current) return;
                isFetchingRef.current = true;
                setLoading(true);
                setHasError(false);
            }

            if (mode === "refresh") {
                if (isRefreshingRef.current || isFetchingRef.current) return;
                isRefreshingRef.current = true;
                setRefreshing(true);
                setHasError(false);
            }

            if (mode === "append") {
                if (isLoadingMoreRef.current || isFetchingRef.current || isRefreshingRef.current) {
                    return;
                }
                isLoadingMoreRef.current = true;
                setLoadingMore(true);
            }

            try {
                // Patch snippet to insert into fetchTickets before api.get
                const params = {
                    search: dateStr,
                    type,
                    page,
                    per_page: PER_PAGE,
                };

                console.log("[TicketPesaje] params =>", params);

                const response = await api.get("/ticket_pesaje", { params });


                const payload = response.data;
                const items = payload.ticket_pesajes?.data ?? [];
                const meta = payload.ticket_pesajes?.meta ?? {};

                const currentPageFromApi = meta.current_page ?? page;
                const lastPageFromApi = meta.last_page ?? 1;
                const totalFromApi = meta.total ?? items.length;

                setTickets((prev) => {
                    if (mode === "append") {
                        const existingIds = new Set(prev.map((item) => item.id));
                        const uniqueNewItems = items.filter((item: any) => !existingIds.has(item.id));
                        return [...prev, ...uniqueNewItems];
                    }

                    return items;
                });

                setCurrentPage(currentPageFromApi);
                setLastPage(lastPageFromApi);
                setTotal(totalFromApi);
                setHasError(false);
            } catch (error: any) {
                console.log("ERROR INDEX", error.response?.data);

                if (mode !== "append") {
                    setHasError(true);
                }
            } finally {
                if (mode === "initial") {
                    isFetchingRef.current = false;
                    setLoading(false);
                }

                if (mode === "refresh") {
                    isRefreshingRef.current = false;
                    setRefreshing(false);
                }

                if (mode === "append") {
                    isLoadingMoreRef.current = false;
                    setLoadingMore(false);
                }
            }
        },
        [dateStr, type]
    );

    const loadInitialTickets = useCallback(() => {
        setTickets([]);
        setCurrentPage(1);
        setLastPage(1);
        setTotal(0);
        fetchTickets({ page: 1, mode: "initial" });
    }, [fetchTickets]);

    const refreshTickets = useCallback(() => {
        setCurrentPage(1);
        setLastPage(1);
        fetchTickets({ page: 1, mode: "refresh" });
    }, [fetchTickets]);

    const loadMoreTickets = useCallback(() => {
        if (loading || refreshing || loadingMore || !hasMorePages) return;
        fetchTickets({ page: currentPage + 1, mode: "append" });
    }, [loading, refreshing, loadingMore, hasMorePages, currentPage, fetchTickets]);

    useEffect(() => {
        loadInitialTickets();
    }, [dateStr, type]);

    const renderFooter = () => {
        if (loadingMore) {
            return (
                <View style={styles.footerLoader}>
                    <ActivityIndicator size="small" />
                    <Text style={styles.footerText}>Cargando más tickets...</Text>
                </View>
            );
        }

        if (tickets.length > 0 && !hasMorePages) {
            return <View style={styles.footerSpace} />;
        }

        return <View style={styles.footerSpace} />;
    };

    const renderEmpty = () => {
        if (loading || hasError) return null;

        return (
                <View style={styles.emptyBox}>
                <MaterialCommunityIcons name="tray" size={30} color="#94A3B8" />
                <Text style={styles.emptyTitle}>No hay tickets</Text>
                <Text style={styles.emptyText}>
                    Prueba con otra fecha o crea un nuevo registro.
                </Text>
            </View>
        );
    };

    return (
        <View style={styles.root}>
            <View style={styles.filterBar}>
            <View style={styles.resultsBox}>
                <Text style={styles.resultsText}>
                    {`${tickets.length} de ${total} resultados`}
                </Text>
            </View>

                <Pressable onPress={() => setOpen(true)} style={styles.dateButton}>
                    <MaterialCommunityIcons name="magnify" size={16} color="#6B7280" />
                    <Text style={styles.dateText}>{dateStr}</Text>
                </Pressable>
            </View>

            <DatePicker
                modal
                open={open}
                mode="date"
                date={date}
                onConfirm={(newDate) => {
                    setOpen(false);
                    setDate(newDate);
                }}
                onCancel={() => {
                    setOpen(false);
                }}
            />

            <View style={styles.content}>
                {loading && (
                    <View style={styles.stateBox}>
                        <ActivityIndicator size="large" />
                        <Text style={styles.stateText}>Cargando tickets...</Text>
                    </View>
                )}

                {!loading && hasError && (
                    <ErrorSection
                        message="No se pudo obtener la información del servidor"
                        onRetry={loadInitialTickets}
                    />
                )}

                {!loading && !hasError && (
                    <FlatList
                        data={tickets}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate(
                                        "ticket_pesaje.show" as never,
                                        { id: item.id } as never
                                    )
                                }
                                style={styles.ticketRow}
                            >
                                <SimpleCard ticket={item} />
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={[styles.listContent, { paddingBottom: 30 + insets.bottom }]}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={renderEmpty}
                        ListFooterComponent={renderFooter}
                        onRefresh={refreshTickets}
                        refreshing={refreshing}
                        onEndReached={() => {
                            if (!onEndReachedCalledDuringMomentum.current && hasMorePages) {
                                loadMoreTickets();
                                onEndReachedCalledDuringMomentum.current = true;
                            }
                        }}
                        onEndReachedThreshold={0.3}
                        onMomentumScrollBegin={() => {
                            onEndReachedCalledDuringMomentum.current = false;
                        }}
                        removeClippedSubviews
                        initialNumToRender={10}
                        maxToRenderPerBatch={10}
                        windowSize={7}
                        updateCellsBatchingPeriod={50}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    filterBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        paddingVertical: 10,
    },
    resultsBox: {
        flex: 1,
        justifyContent: "center",
    },
    resultsText: {
        color: "#111827",
        fontSize: 13,
        fontWeight: "500",
    },
    resultsLabel: {
        color: "#94A3B8",
        fontSize: 11,
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 0.6,
    },
    resultsValue: {
        color: "#111827",
        fontSize: 20,
        fontWeight: "800",
        marginTop: 2,
    },
    dateButton: {
        minHeight: 36,
        borderRadius: 999,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "rgba(17, 24, 39, 0.08)",
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    dateText: {
        color: "#111827",
        fontSize: 12,
        fontWeight: "600",
    },
    content: {
        flex: 1,
        minHeight: 0,
    },
    stateBox: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 34,
    },
    stateText: {
        marginTop: 10,
        color: "#6B7280",
        fontSize: 13,
    },
    emptyBox: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 24,
        paddingHorizontal: 16,
        borderRadius: 16,
        backgroundColor: "rgba(255,255,255,0.85)",
        borderWidth: 1,
        borderColor: "rgba(17, 24, 39, 0.06)",
        marginBottom: 10,
        marginTop: 8,
    },
    emptyTitle: {
        color: "#111827",
        fontSize: 15,
        fontWeight: "800",
        marginTop: 8,
    },
    emptyText: {
        color: "#6B7280",
        fontSize: 13,
        textAlign: "center",
        marginTop: 4,
        lineHeight: 18,
    },
    listContent: {
        flexGrow: 1,
    },
    ticketRow: {
        marginBottom: 10,
    },
    footerLoader: {
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    footerText: {
        marginTop: 8,
        color: "#6B7280",
        fontSize: 12,
    },
    footerSpace: {
        height: 20,
    },
});

export default Index;

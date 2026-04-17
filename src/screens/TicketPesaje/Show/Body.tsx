import LottieView from "lottie-react-native";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useContext } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import TabsSection from "./TabsSection";
import SimpleCard from "../../../components/Ticket/SimpleCard";
import { TicketContext } from "./provider/TicketProvider";
import ErrorSection from "../../../components/ErrorSection";

const Body = () => {
    const { loading, hasError, loadTicket, ticketPesaje } = useContext(TicketContext);
    const insets = useSafeAreaInsets();

    return (
        <ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.content, { paddingBottom: 22 + insets.bottom }]}
            showsVerticalScrollIndicator={false}
        >
            {loading ? (
                <View style={styles.stateBox}>
                    <LottieView style={styles.loadingAnimation} source={require("../../../../assets/lottie/loading.json")} autoPlay loop />
                    <View style={styles.loadingRow}>
                        <ActivityIndicator size="small" color="#111827" />
                        <Text style={styles.loadingText}>Cargando ticket...</Text>
                    </View>
                </View>
            ) : null}

            {hasError ? (
                <ErrorSection
                    message="No se pudo obtener los datos desde el servidor"
                    onRetry={loadTicket}
                />
                ) : null}

                {!loading && !hasError && ticketPesaje ? (
                <>
                    <SimpleCard />
                    <TabsSection />
                </>
            ) : null}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
        backgroundColor: "transparent",
    },
    content: {
        padding: 10,
        gap: 10,
    },
    stateBox: {
        paddingTop: 14,
        paddingBottom: 8,
        alignItems: "center",
    },
    loadingAnimation: {
        height: 220,
        width: "100%",
    },
    loadingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 6,
    },
    loadingText: {
        color: "#6B7280",
        fontSize: 14,
        fontWeight: "600",
    },
});

export default Body;

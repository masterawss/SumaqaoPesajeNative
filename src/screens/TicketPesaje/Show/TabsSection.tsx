import { View, StyleSheet } from "react-native";
import { useContext, useState } from "react";

import GuiaRemision from "../components/GuiaRemision";
import Pesaje from "../components/Pesaje";
import Resumen from "../components/Resumen";
import Saco from "../components/Saco";
import { TicketContext } from "./provider/TicketProvider";
import AppTabChip from "../../../components/ui/AppTabChip";

const TabsSection = () => {
    const [tab, setTab] = useState("guia_remision");
    const { ticketPesaje } = useContext(TicketContext) as any;

    return (
        <View style={styles.container}>
            <View style={styles.tabsWrap}>
                <AppTabChip
                    label="Guías"
                    icon="truck-fast-outline"
                    active={tab === "guia_remision"}
                    onPress={() => setTab("guia_remision")}
                />
                {!ticketPesaje.is_exportacion ? (
                    <AppTabChip
                        label="Sacos"
                        icon="shopping-outline"
                        active={tab === "saco"}
                        onPress={() => setTab("saco")}
                    />
                ) : null}
                <AppTabChip
                    label="Pesaje"
                    icon="scale-bathroom"
                    active={tab === "pesaje"}
                    onPress={() => setTab("pesaje")}
                />
                <AppTabChip
                    label="Resumen"
                    icon="file-document-outline"
                    active={tab === "resumen"}
                    onPress={() => setTab("resumen")}
                />
            </View>
            <View style={styles.content}>
                <Tab tab={tab} />
            </View>
        </View>
    );
};

const Tab = ({ tab }: { tab: string }) => {
    switch (tab) {
        case "guia_remision":
            return <GuiaRemision />;
        case "pesaje":
            return <Pesaje />;
        case "saco":
            return <Saco />;
        default:
            return <Resumen />;
    }
};

const styles = StyleSheet.create({
    container: {
        gap: 10,
    },
    tabsWrap: {
        flexDirection: "row",
        gap: 6,
        flexWrap: "wrap",
    },
    content: {},
});

export default TabsSection;

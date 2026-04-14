import React, { useContext } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { TicketContext } from "../../Show/provider/TicketProvider";
import AppButton from "../../../../components/ui/AppButton";
import AppModalSheet from "../../../../components/ui/AppModalSheet";
import AppRadio from "../../../../components/ui/AppRadio";

const GuiaRemisionSelect = ({
    guia_remision_codigo,
    onSelect,
    guiasRemision
}:{
    guia_remision_codigo: string,
    onSelect: Function,
    guiasRemision?: any[]
}) => {
    const [visible, setVisible] = React.useState(false);
    const {ticketPesaje} = useContext(TicketContext) as any;
    const [guiaRemisionSelected, setGuiaRemisionSelected] = React.useState<any>(guia_remision_codigo);

    const guias = guiasRemision || ticketPesaje?.guias_remision ;

    const changeGuiaRemision = () => {
        const guia_remision = guias.find((guia: any) => guia.codigo === guiaRemisionSelected);
        onSelect(guia_remision);
        setVisible(false);
    }

    return <>
        <Pressable style={styles.trigger} onPress={() => setVisible(true)}>
            <Text style={styles.triggerText}>G.R.R: {guia_remision_codigo || "Sin GRR"}</Text>
            <MaterialCommunityIcons name="chevron-down" size={18} color="#6B7280" />
        </Pressable>

        <AppModalSheet
            visible={visible}
            onClose={() => setVisible(false)}
            title="Cambiar guía de remisión"
            subtitle="Selecciona la guía que corresponde a este registro."
        >
            <View style={styles.options}>
                {guias.length > 0 && guias.map((guia: any, index: number) => (
                    <AppRadio
                        key={index}
                        label={guia.codigo}
                        checked={guia.codigo === guiaRemisionSelected}
                        onPress={() => setGuiaRemisionSelected(guia.codigo)}
                    />
                ))}
            </View>
            <AppButton style={{ marginTop: 12 }} onPress={changeGuiaRemision}>
                Cambiar
            </AppButton>
        </AppModalSheet>
    </>
}

const styles = StyleSheet.create({
    trigger: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 999,
        backgroundColor: "#F3F4F6",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    triggerText: {
        color: "#374151",
        fontSize: 13,
        fontWeight: "600",
        marginRight: 6,
    },
    options: {
        marginBottom: 4,
    },
});

export default GuiaRemisionSelect;

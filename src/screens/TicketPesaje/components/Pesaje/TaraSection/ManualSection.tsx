import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Edit } from "./ManualSection/Edit";
import saveHook from "./ManualSection/saveHook";
import GuiaRemisionSelect from "../GuiaRemisionSelect";
import AppInput from "../../../../../components/ui/AppInput";
import AppButton from "../../../../../components/ui/AppButton";
const Snackbar = require("react-native-snackbar");

const ManualSection = ({
    ticketPesaje,
    setVisible,
    loadTicket,
    isEdit,
    currentGuiaRemision,
    hasGuiasRemision,
    setCurrentGuiaRemision,
    setNextGuiaRemision,
    peso_solo_paletas,
    guiasRemision
} : any ) => {
    const [taraKg, setTaraKg] = React.useState("0");
    const [loadingTara, setLoadingTara] = React.useState(false);

    const {save} = saveHook({setLoadingTara, setVisible, ticketPesaje, loadTicket})

    useEffect(() => {
        if(peso_solo_paletas) {
            setTaraKg(peso_solo_paletas)
        }
    }, [peso_solo_paletas])

    const saveTara = async (tara: number) => {
        try {
            await save({tara, guia_remision_id: currentGuiaRemision?.id})
            setNextGuiaRemision()
        } catch (error) {
            Snackbar.show({
                text: 'No se pudo registrar la tara',
                duration: Snackbar.LENGTH_INDEFINITE,
                action: {
                    text: 'Cerrar',
                    textColor: 'red',
                    onPress: () => {},
                },
            });
        }
    }

    return (
        <>
            {hasGuiasRemision ? (
                <View style={styles.assignmentRow}>
                    <Text style={styles.assignmentLabel}>Se registrará para:</Text>
                    <GuiaRemisionSelect
                        guiasRemision={guiasRemision}
                        guia_remision_codigo={currentGuiaRemision.codigo}
                        onSelect={(guia:any) => {
                            setCurrentGuiaRemision(guia)
                        }}
                    />
                </View>
            ) : null}
            {!isEdit ? (
                <View>
                    <AppInput label="Peso (Kg)" keyboardType="numeric" value={taraKg} onChangeText={val => setTaraKg(val)} />
                    <AppButton loading={loadingTara} disabled={loadingTara} style={{ marginTop: 12 }} onPress={() => saveTara(parseFloat(taraKg))}>
                        Guardar
                    </AppButton>
                </View>
            ) : (
                <Edit taraInicial={peso_solo_paletas} loading={loadingTara} onSaveHandler={(tara: number) => saveTara(tara)} />
            )}
        </>
    )
}

const styles = StyleSheet.create({
    assignmentRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        gap: 12,
    },
    assignmentLabel: {
        color: "#111827",
        fontSize: 13,
        fontWeight: "600",
    },
});

export default ManualSection;

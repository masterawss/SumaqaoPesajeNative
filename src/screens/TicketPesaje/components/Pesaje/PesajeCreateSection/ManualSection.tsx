import { Text, View, StyleSheet } from "react-native";
import React, { useContext } from "react";

import savePesoHook from "./hook/savePesoHook";
import { TicketContext } from "../../../Show/provider/TicketProvider";
import GuiaRemisionSelect from "../GuiaRemisionSelect";
import AppInput from "../../../../../components/ui/AppInput";
import AppButton from "../../../../../components/ui/AppButton";
const Snackbar = require("react-native-snackbar");

const ManualSection = () => {
    const [peso, setPeso] = React.useState<any>(null)
    const {loading, saveData} = savePesoHook()
    const {currentGuiaRemision, setNextGuiaRemision, setCurrentGuiaRemision} = useContext(TicketContext) as any;

    const save = async () => {
        if(peso && peso > 0){
            await saveData({
                peso,
                by_bluetooth: false,
                guia_remision_id: currentGuiaRemision?.id
            })
            setPeso(null)
            setNextGuiaRemision()
        }else{
            Snackbar.show({
                text: 'Ingrese un valor correcto',
                duration: Snackbar.LENGTH_SHORT,
                action: {
                  text: 'Cerrar',
                  textColor: 'red',
                  onPress: () => {},
                },
              });
        }
    }

    return <>
        {currentGuiaRemision ? (
            <View style={styles.assignmentRow}>
                <Text style={styles.assignmentLabel}>Se registrará para:</Text>
                <GuiaRemisionSelect
                    guia_remision_codigo={currentGuiaRemision.codigo}
                    onSelect={(guia: any) => {
                        setCurrentGuiaRemision(guia);
                    }}
                />
            </View>
        ) : (
            <Text style={styles.assignmentEmpty}>Se registrará sin GRR</Text>
        )}
        <View style={styles.formRow}>
            <View style={{ flex: 1 }}>
                <AppInput
                    placeholder="Peso (Kg)"
                    keyboardType="numeric"
                    value={peso}
                    onChangeText={val => setPeso(val)}
                />
            </View>
            <AppButton compact disabled={loading} loading={loading} onPress={save}>
                Guardar
            </AppButton>
        </View>
    </>
}

const styles = StyleSheet.create({
    assignmentRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 0,
        marginBottom: 8,
        gap: 6,
    },
    assignmentLabel: {
        color: "#111827",
        fontSize: 11,
        fontWeight: "600",
    },
    assignmentEmpty: {
        color: "#6B7280",
        fontSize: 11,
        marginBottom: 8,
    },
    formRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
});

export default ManualSection;

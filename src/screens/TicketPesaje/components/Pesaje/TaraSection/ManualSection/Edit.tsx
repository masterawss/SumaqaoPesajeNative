import { Text , StyleSheet, View } from "react-native"
import React, { useMemo } from "react";

import AppRadio from "../../../../../../components/ui/AppRadio";
import AppInput from "../../../../../../components/ui/AppInput";
import AppButton from "../../../../../../components/ui/AppButton";

export const Edit = ({taraInicial, loading, onSaveHandler}:any) => {
    const [typeChange, setTypeChange] = React.useState('sumar');
    const [taraKgDif, setTaraKgDif] = React.useState("0");

    const taraFinalCalculated = useMemo(() => {
        if(typeChange === 'sumar') {
            return parseInt(taraKgDif) + parseInt(taraInicial)
        } else {
            return parseInt(taraKgDif) - parseInt(taraInicial)
        }
    }, [typeChange, taraKgDif, taraInicial])

    const pressHandler = () => {
        onSaveHandler(taraFinalCalculated)
    }

    return <>
        <Text style={styles.title}>Tara actual: {taraInicial} Kg</Text>
        <View style={styles.radioGroup}>
            <AppRadio label="Sumar" checked={typeChange === 'sumar'} onPress={() => setTypeChange('sumar')} />
            <AppRadio label="Restar" checked={typeChange === 'restar'} onPress={() => setTypeChange('restar')} />
        </View>
        <AppInput
            label="Peso (Kg)"
            keyboardType="numeric"
            value={taraKgDif}
            onChangeText={val => setTaraKgDif(val)}
        />

        <Text style={styles.finalText}>Nuevo valor de tara al guardar: {taraFinalCalculated} Kg</Text>

        <AppButton loading={loading} disabled={loading} style={{ marginTop: 12 }} onPress={pressHandler}>
            Guardar
        </AppButton>
    </>
}

const styles = StyleSheet.create({
    title: {
        color: "#111827",
        fontSize: 15,
        fontWeight: "800",
        marginBottom: 10,
    },
    radioGroup: {
        marginBottom: 12,
    },
    finalText: {
        color: "#111827",
        fontSize: 15,
        fontWeight: "700",
        marginTop: 12,
    },
});

import { Button, RadioButton, Text , TextInput} from "react-native-paper"
import {View, } from "react-native"
import React, { useMemo } from "react";

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
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Tara actual: {taraInicial} Kg</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5, marginTop: 25 }}>
            <RadioButton
                value="first"
                status={ typeChange === 'sumar' ? 'checked' : 'unchecked' }
                onPress={() => setTypeChange('sumar')}
            />
            <Text style={{ fontSize: 18 }}>Sumar</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5, marginBottom: 25 }}>
            <RadioButton
                value="first"
                status={ typeChange === 'restar' ? 'checked' : 'unchecked' }
                onPress={() => setTypeChange('restar')}
            />
            <Text style={{ fontSize: 18 }}>Restar</Text>
        </View>
        <TextInput
            mode="outlined"
            label="Peso (Kg)"
            keyboardType="numeric"
            value={taraKgDif}
            onChangeText={val => setTaraKgDif(val)}
        />

        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Nuevo valor de tara al guardar: {taraFinalCalculated} Kg</Text>

        <Button loading={loading} disabled={loading} style={{ marginTop: 10 }} mode="contained" onPress={pressHandler}>
            Guardar
        </Button>
    </>
}
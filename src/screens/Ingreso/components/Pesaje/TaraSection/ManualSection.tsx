import React, { useContext, useEffect, useMemo } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native"
import { Button, IconButton, Modal, Portal, RadioButton, Text, TextInput } from "react-native-paper"
import api from "../../../../../utils/axios";
import Snackbar from "react-native-snackbar";
import { TicketContext } from "../../../Show/provider/TicketProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Edit } from "./ManualSection/Edit";
import saveHook from "./ManualSection/saveHook";

const ManualSection = ({ticketPesaje, setVisible} : any ) => {
    const [taraValue, setTaraValue] = React.useState("0");
    const [taraKg, setTaraKg] = React.useState("0");
    const [loadingTara, setLoadingTara] = React.useState(false);

    const {save} = saveHook({setLoadingTara, setVisible})

    const isEdit = useMemo(() => {
        return parseInt(taraValue) > 0
    }, [taraValue])


    useEffect(() => {
        if(ticketPesaje?.peso_solo_paletas) {
            setTaraValue(ticketPesaje?.peso_solo_paletas)
            setTaraKg(ticketPesaje?.peso_solo_paletas)
        }
    }, [ticketPesaje])

    return (
        <>
            {
                !isEdit ? <View>
                    <TextInput mode="outlined" label="Peso (Kg)" keyboardType="numeric" value={taraKg} onChangeText={val => setTaraKg(val)} />
                    <Button loading={loadingTara} disabled={loadingTara} style={{ marginTop: 10 }} mode="contained" onPress={() => save(parseFloat(taraKg))}>
                        Guardar
                    </Button>
                </View>
                : <Edit taraInicial={ticketPesaje.peso_solo_paletas} loading={loadingTara} onSaveHandler={(tara) => save(parseFloat(tara))} />
            }
        </>
    )
}

export default ManualSection;
import React, { useContext, useEffect, useMemo } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native"
import { Button, IconButton, Modal, Portal, RadioButton, Text, TextInput } from "react-native-paper"
import api from "../../../../../utils/axios";
import Snackbar from "react-native-snackbar";
import { TicketContext } from "../../../Show/provider/TicketProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Edit } from "./ManualSection/Edit";
import saveHook from "./ManualSection/saveHook";
import GuiaRemisionSelect from "../GuiaRemisionSelect";

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
    const [taraValue, setTaraValue] = React.useState("0");
    const [taraKg, setTaraKg] = React.useState("0");
    const [loadingTara, setLoadingTara] = React.useState(false);
    // const { loadTicket, ticketPesaje } = useContext(TicketContext);

    const {save} = saveHook({setLoadingTara, setVisible, ticketPesaje, loadTicket})

    useEffect(() => {
        if(peso_solo_paletas) {
            setTaraValue(peso_solo_paletas)
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
                    onPress: () => { /* Do something. */ },
                },
            });
        }
    }

    return (
        <>
            {
                hasGuiasRemision 
                    && <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between',  alignItems: 'center', marginVertical: 20 }}>
                        <Text style={{ fontWeight: 'bold' }}>Se registrará para:</Text>
                        <GuiaRemisionSelect
                            guiasRemision={guiasRemision}
                            guia_remision_codigo={currentGuiaRemision.codigo}
                            onSelect={(guia:any) => {
                                setCurrentGuiaRemision(guia)
                            }}
                        />
                    </View>
            }
            {
                !isEdit ? <View>
                    <TextInput mode="outlined" label="Peso (Kg)" keyboardType="numeric" value={taraKg} onChangeText={val => setTaraKg(val)} />
                    <Button loading={loadingTara} disabled={loadingTara} style={{ marginTop: 10 }} mode="contained" 
                        onPress={() => saveTara(parseFloat(taraKg))}
                        // onPress={() => console.log('asdadadasdadasd')}
                    >
                        Guardar
                    </Button>
                </View>
                : <Edit taraInicial={peso_solo_paletas} loading={loadingTara} onSaveHandler={(tara) => saveTara(tara)} />
            }
        </>
    )
}

export default ManualSection;
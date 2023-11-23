import { Button, Text, TextInput } from "react-native-paper";
import { ActivityIndicator, View } from "react-native";
import React, { useContext } from "react";
import savePesoHook from "./hook/savePesoHook";
import { TicketContext } from "../../../Show/provider/TicketProvider";
import Snackbar from "react-native-snackbar";

const ManualSection = () => {
    const [loading, setLoading] = React.useState(false);
    const [peso, setPeso] = React.useState<any>(null)
    const {loading: loadingSave, error, saveData} = savePesoHook()

    // const { hasError, loadTicket, ticketPesaje, deleteTicket } = useContext(TicketContext);

    const save = async () => {
        if(peso && peso > 0){
            await saveData(peso, false)
            setPeso(null)
        }else{
            Snackbar.show({
                text: 'Ingrese un valor correcto',
                duration: Snackbar.LENGTH_SHORT,
                action: {
                  text: 'Cerrar',
                  textColor: 'red',
                  onPress: () => { /* Do something. */ },
                },
              });
        }
    }

    return <>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
            <TextInput
                mode="outlined"
                label="Peso (Kg)"
                keyboardType="numeric"
                value={peso}
                onChangeText={val => setPeso(val)}
            />
            <Button mode="contained" disabled={loading} loading={loading} onPress={save} >
                Guardar
            </Button>
        </View>
    </>
}

export default ManualSection;
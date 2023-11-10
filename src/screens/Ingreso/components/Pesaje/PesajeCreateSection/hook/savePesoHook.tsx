import React, { useContext } from "react";
import Snackbar from "react-native-snackbar";
import { TicketContext } from "../../../../Show/provider/TicketProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../../../../utils/axios";

export default () => {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);

    const { hasError, loadTicket, ticketPesaje, deleteTicket } = useContext(TicketContext);

    const saveData = async (peso: any, by_bluetooth = false) => {
        setLoading(true);
        setError(false);
        const user = await AsyncStorage.getItem('user');
        api.post('/ticket_pesaje_detalle/store', {
            peso_bruto: peso,
            ticket_pesaje_id: ticketPesaje.id,
            created_user_id: JSON.parse(user || '').id,
            by_bluetooth
        }).then((response) => {
            console.log(response);
            setLoading(false);
            Snackbar.show({
                text: 'Se registró correctamente',
                duration: Snackbar.LENGTH_SHORT,
                action: {
                  text: 'Cerrar',
                  textColor: 'green',
                  onPress: () => { /* Do something. */ },
                },
            });
            loadTicket();
        }).catch((error) => {
            console.log(error.response);
            setLoading(false);
            setError(true);
            Snackbar.show({
                text: 'No se pudo registrar el peso',
                duration: Snackbar.LENGTH_INDEFINITE,
                action: {
                  text: 'Cerrar',
                  textColor: 'red',
                  onPress: () => { /* Do something. */ },
                },
            });
        })
        .finally(() => {
            setLoading(false);
        })
    }

    return {
        loading,
        error,
        saveData
    }
}
import React, { useContext } from "react";
import { TicketContext } from "../../../../Show/provider/TicketProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../../../../utils/axios";
import { Snackbar } from "../../../../../../utils/snackbar";

interface ISaveDataProps {
    peso: any;
    by_bluetooth: boolean;
    guia_remision_id?: any;
}

export default () => {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);

    const { ticketPesaje, loadTicket } = useContext(TicketContext) as any;

    const saveData = async ({
        peso, 
        by_bluetooth = false,
        guia_remision_id = null
    }: ISaveDataProps) => {
        setLoading(true);
        setError(false);
        const user = await AsyncStorage.getItem('user');
        try {
            await api.post('/ticket_pesaje_detalle/store', {
                peso_bruto: peso,
                ticket_pesaje_id: ticketPesaje.id,
                created_user_id: JSON.parse(user || '').id,
                by_bluetooth,
                guia_remision_id
            });

            await loadTicket();
            Snackbar.show({
                text: 'Se registró correctamente',
                duration: Snackbar.LENGTH_SHORT,
                action: {
                  text: 'Cerrar',
                  textColor: 'green',
                  onPress: () => {},
                },
            });
            return true;
        } catch (error: any) {
            console.log(error.response);
            setError(true);
            Snackbar.show({
                text: 'No se pudo registrar el peso',
                duration: Snackbar.LENGTH_INDEFINITE,
                action: {
                  text: 'Cerrar',
                  textColor: 'red',
                  onPress: () => {},
                },
            });
            return false;
        } finally {
            setLoading(false);
        }
    }

    return {
        loading,
        error,
        saveData
    }
}

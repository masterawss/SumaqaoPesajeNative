import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../../../../utils/axios";
import { useContext } from "react";
import { TicketContext } from "../../../../Show/provider/TicketProvider";
import Snackbar from "react-native-snackbar";

interface ISaveProps {
    tara: number,
    guia_remision_id?: number|null
}

const saveHook = ({setLoadingTara, setVisible, ticketPesaje, loadTicket}: any) => {

    // const { loadTicket, ticketPesaje } = useContext(TicketContext);

    const save = async ({tara, guia_remision_id}: ISaveProps, cb = () => {}) => {
        console.log('SAVEEE', tara, ticketPesaje.id)
        setLoadingTara(true)
        const user = await AsyncStorage.getItem('user');
        api.post('/tara', {
            ticket_pesaje_id: ticketPesaje.id,
            peso_solo_paletas: tara,
            guia_remision_id,
            updated_user_id: JSON.parse(user || "")?.id
        })
        .then((response) => {
            console.log(response.data)
            setVisible(false)
            loadTicket()
            cb()
            Snackbar.show({
                text: 'Se registró la tara correctamente',
                duration: Snackbar.LENGTH_SHORT,
                action: {
                  text: 'Cerrar',
                  textColor: 'green',
                  onPress: () => { /* Do something. */ },
                },
            });
        })
        .catch((error) => {
            console.log("ERROR", error.response)
            Snackbar.show({
                text: 'No se pudo registrar la tara',
                duration: Snackbar.LENGTH_INDEFINITE,
                action: {
                  text: 'Cerrar',
                  textColor: 'red',
                  onPress: () => { /* Do something. */ },
                },
            });
        })
        .finally(() => {
            setLoadingTara(false)
        })
    }

    return {
        save
    }
}
export default saveHook
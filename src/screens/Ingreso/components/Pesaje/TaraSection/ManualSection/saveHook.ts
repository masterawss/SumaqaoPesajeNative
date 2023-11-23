import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../../../../utils/axios";
import { useContext } from "react";
import { TicketContext } from "../../../../Show/provider/TicketProvider";
import Snackbar from "react-native-snackbar";

const saveHook = ({setLoadingTara, setVisible, ticketPesaje, loadTicket}: any) => {

    // const { loadTicket, ticketPesaje } = useContext(TicketContext);

    const save = async (tara:number, cb = () => {}) => {
        console.log('SAVEEE', tara, ticketPesaje.id)
        setLoadingTara(true)
        const user = await AsyncStorage.getItem('user');
        api.post('/ticket_pesaje/update/'+ticketPesaje.id, { 
            peso_solo_paletas: tara,
            updated_user_id: JSON.parse(user || "")?.id
        })
        .then((response) => {
            console.log(response.data)
            setVisible(false)
            loadTicket()
            cb()
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
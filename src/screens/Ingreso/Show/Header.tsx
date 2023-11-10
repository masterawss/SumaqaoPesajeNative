import { useNavigation } from "@react-navigation/native";
import { Appbar } from "react-native-paper"
import { TicketContext } from "./provider/TicketProvider";
import { useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../utils/axios";
import Snackbar from "react-native-snackbar";

const Header = () => {
    const navigation = useNavigation();
    const { loading, hasError, loadTicket, ticketPesaje, deleteTicket } = useContext(TicketContext);


    const saveTicket = async () => {
        const user = await AsyncStorage.getItem('user');
        api.post('/ticket_pesaje/update/'+ticketPesaje.id, { 
            is_saved: 1,
            updated_user_id: JSON.parse(user || "")?.id
        })
        .then((response) => {
            console.log(response.data)
            loadTicket()
        })
        .catch((error) => {
            console.log(error.response)
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
            // setLoadingTara(false)
        })
    }

    return <Appbar.Header>
        <Appbar.BackAction onPress={() => {navigation.goBack()}} />
        <Appbar.Content title="Ticket de pesaje" />
        {
            !ticketPesaje?.is_saved && <Appbar.Action icon="safe" onPress={saveTicket} />
        }
        <Appbar.Action icon="pencil" onPress={() => {}} />
        <Appbar.Action icon="delete" onPress={deleteTicket} />
        <Appbar.Action icon="sync" onPress={loadTicket} />
    </Appbar.Header>
}

export default Header;
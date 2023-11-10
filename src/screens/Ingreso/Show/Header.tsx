import { useNavigation } from "@react-navigation/native";
import { Appbar } from "react-native-paper"
import { TicketContext } from "./provider/TicketProvider";
import { useContext } from "react";

const Header = () => {
    const navigation = useNavigation();
    const { loading, hasError, loadTicket, ticketPesaje, deleteTicket } = useContext(TicketContext);

    return <Appbar.Header>
        <Appbar.BackAction onPress={() => {navigation.goBack()}} />
        <Appbar.Content title="Ticket de pesaje" />
        <Appbar.Action icon="pencil" onPress={() => {}} />
        <Appbar.Action icon="delete" onPress={deleteTicket} />
        <Appbar.Action icon="sync" onPress={loadTicket} />
    </Appbar.Header>
}

export default Header;
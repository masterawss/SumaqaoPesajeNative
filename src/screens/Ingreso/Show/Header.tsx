import { useNavigation } from "@react-navigation/native";
import { Appbar, Button, Divider, IconButton, Menu, Text } from "react-native-paper"
import { TicketContext } from "./provider/TicketProvider";
import {Alert} from 'react-native';
import React, { useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../utils/axios";
import Snackbar from "react-native-snackbar";
import {ProgressBar} from '@react-native-community/progress-bar-android';

const Header = () => {
    const navigation = useNavigation();
    const { loading, loadingSimple, hasError, loadTicket, ticketPesaje, deleteTicket, saveTicket } = useContext(TicketContext);
    const [visibleMenu, setVisibleMenu] = React.useState(false);

    const haveToResetTicket = async () => {
        const resetTicket = await AsyncStorage.getItem('resetTicket');
        if(resetTicket == "1"){
            loadTicket();
            await AsyncStorage.setItem('resetTicket', "0");
        }
    }

    useEffect(() => {
        haveToResetTicket();
    },[])

    return <>
        <Appbar.Header>
            <Appbar.BackAction onPress={() => {navigation.goBack()}} />
            <Appbar.Content title="Ticket de pesaje" />
            {/* {
                !ticketPesaje?.is_saved && <Appbar.Action icon="safe" onPress={saveTicket} />
            }
            <Appbar.Action icon="pencil" onPress={() => {}} />
            <Appbar.Action icon="delete" onPress={deleteTicket} />
            <Appbar.Action icon="sync" onPress={loadTicket} /> */}
            <Menu
            visible={visibleMenu}
            onDismiss={() => setVisibleMenu(false)}
            anchor={<IconButton icon="dots-vertical" onPress={() => setVisibleMenu(true)} />}>
                {
                    !ticketPesaje?.is_saved && <Menu.Item onPress={saveTicket} title="Guardar" />
                }
                <Menu.Item onPress={loadTicket} title="Recargar" />
                <Divider />
                <Menu.Item onPress={deleteTicket} title="Eliminar" />
            </Menu>
        </Appbar.Header>
        {
            loadingSimple &&
                <ProgressBar styleAttr="Horizontal" color="#fc7f03" />
        }
    </>
}

export default Header;
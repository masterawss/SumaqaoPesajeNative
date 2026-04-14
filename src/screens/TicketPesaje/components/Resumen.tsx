import { useContext, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebView from 'react-native-webview';

import { TicketContext } from '../Show/provider/TicketProvider';
import { API_BASE_URL } from '../../../utils/constants';
import AppSurface from '../../../components/ui/AppSurface';

const Resumen = () => {
    const { loadTicket, ticketPesaje } = useContext(TicketContext) as any;

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

    return (
        <AppSurface style={styles.card}>
            <Text style={styles.title}>Resumen</Text>
            <Text style={styles.subtitle}>Vista consolidada del ticket.</Text>
            <View style={styles.webviewWrap}>
                <WebView
                    source={{ uri: API_BASE_URL+'/almacen/ticket_pesaje/'+ticketPesaje.id+'/resumen' }}
                    style={styles.webview}
                />
            </View>
        </AppSurface>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 14,
    },
    title: {
        color: "#111827",
        fontSize: 16,
        fontWeight: "800",
    },
    subtitle: {
        color: "#6B7280",
        fontSize: 12,
        marginTop: 2,
        marginBottom: 12,
    },
    webviewWrap: {
        overflow: "hidden",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        backgroundColor: "#FFFFFF",
    },
    webview: {
        height: 600,
    },
});

export default Resumen;

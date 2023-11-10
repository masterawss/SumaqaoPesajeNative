import React, { createContext, useEffect } from 'react';
import api from '../../../../utils/axios';
import {View, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native-paper';

export const TicketContext = createContext({
    ticketId: null,
    ticketPesaje: null,
    loading: false,
    hasError: false,
    loadTicket: () => {},
    deleteTicket: () => {},
});

export default ({ticketId, children}:any) => {
    // const [ticketId, setTicketId] = React.useState<any>(null)
    const [ticketPesaje, setTicketPesaje] = React.useState<any>(null)
    const [loading, setLoading] = React.useState(false);
    const [hasError, setHasError] = React.useState(false);

    const navigation = useNavigation();

    useEffect(() => {
        if(ticketId)
            loadTicket()
    }, [ticketId])

    const loadTicket = () => {
        setLoading(true);
        setHasError(false);
        api.get('/ticket_pesaje/'+ticketId).then((response) => {
            console.log(response.data);
            setTicketPesaje(response.data.ticket_pesaje);
        }).catch((error) => {
            console.log(error.response);
            setHasError(true);
        }).finally(() => {
            setLoading(false);
        });
    }

    const deleteTicket = () => {
        Alert.alert('Eliminar ticket', '¿Está seguro que desea eliminar el ticket?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                onPress: () => {
                    deleteTicketConfirmed();
                }
            }
        ]);
    }

    const deleteTicketConfirmed = async () => {
      api.delete('/ticket_pesaje/'+id).then((response) => {
          console.log(response.data);
          navigation.navigate('home');
      }).catch((error) => {
          console.log(error);
      }).finally(() => {
      });
    }

    return <TicketContext.Provider value={{ 
        ticketId,
        ticketPesaje,
        loading,
        hasError,
        loadTicket,
        deleteTicket
     }}>
        {children}
    </TicketContext.Provider>
}
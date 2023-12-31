import React, { createContext, useEffect } from 'react';
import api from '../../../../utils/axios';
import {View, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';

export const TicketContext = createContext({
    ticketId: null,
    setId: (id: any) => {},
    ticketPesaje: null,
    loadingSimple: false,
    loading: false,
    hasError: false,
    reload: false,
    loadTicket: () => {},
    deleteTicket: () => {},
    saveTicket: () => {},
    assignReload: (v:boolean) => {}
});

export default ({children}:any) => {
    const [reload, setReload] = React.useState(false);
    const [ticketId, setTicketId] = React.useState<any>(null)
    const [ticketPesaje, setTicketPesaje] = React.useState<any>(null)
    const [loading, setLoading] = React.useState(false);
    const [hasError, setHasError] = React.useState(false);
    const [loadingSimple, setLoadingSimple] = React.useState(false);

    const navigation = useNavigation();

    const setId = (id: any) => setTicketId(id);
    const assignReload = (val:boolean) => setReload(val);

    useEffect(() => {
        if(ticketId){
            loadTicket(true)
        }
    }, [ticketId])

    const loadTicket = (withLoader = false) => {
        if(withLoader){
            setLoading(true);
        }else{
            setLoadingSimple(true);
        }
        setHasError(false);
        api.get('/ticket_pesaje/'+ticketId).then((response) => {
            console.log(response.data);
            setTicketPesaje(response.data.ticket_pesaje);
        }).catch((error) => {
            console.log(error.response);
            setHasError(true);
        }).finally(() => {
            setLoadingSimple(false);
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
        const user = await AsyncStorage.getItem('user');

      api.delete('/ticket_pesaje/'+ticketId, {
        params: {
            deleted_user_id: JSON.parse(user || "{}")?.id
        }
      }).then((response) => {
          console.log(response.data);
          Snackbar.show({
                text: 'Se eliminó correctamente',
                duration: Snackbar.LENGTH_SHORT,
                action: {
                text: 'Cerrar',
                textColor: 'green',
                onPress: () => { /* Do something. */ },
                },
            });
          navigation.navigate('home');
      }).catch((error) => {
        Snackbar.show({
            text: 'No se pudo eliminar el ticket',
            duration: Snackbar.LENGTH_INDEFINITE,
            action: {
              text: 'Cerrar',
              textColor: 'red',
              onPress: () => { /* Do something. */ },
            },
        });
        return;
      }).finally(() => {
      });
    }

    const saveTicket = async () => {
        const user = await AsyncStorage.getItem('user');
        api.post('/ticket_pesaje/update/'+ticketId, { 
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
                text: 'No se pudo guardar los datos',
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

    return <TicketContext.Provider value={{ 
        ticketId,
        setId,
        ticketPesaje,
        loading,
        loadingSimple,
        hasError,
        loadTicket,
        deleteTicket,
        saveTicket,
        assignReload,
        reload
     }}>
        {children}
    </TicketContext.Provider>
}
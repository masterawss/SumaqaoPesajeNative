import { Alert, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import api from '../../../utils/axios';
import { useContext, useEffect, useState } from 'react';
import Snackbar from 'react-native-snackbar';
import { TicketContext } from '../../Ingreso/Show/provider/TicketProvider';

const SimpleCard = ({guiaRemision, ticketId, isInTicket = false}: any) => {
    const ticketContext = useContext(TicketContext);

    const [loading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        if(guiaRemision.ticket_pesaje_id === ticketId){
            setAdded(true);
        }else{
            setAdded(false);
        }
    }, []);


    const deleteGuiaRemision = () => {
        Alert.alert('Quitar guia de ingreso', '¿Está seguro que desea quitar la guía de ingreso?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                onPress: () => {
                    deleteGuiaRemisionConfirmed();
                }
            }
        ]);
    }

    const deleteGuiaRemisionConfirmed = () => {
        setLoading(true);
        setHasError(false);
        api.delete('/pesaje_guia_remision/'+guiaRemision.id).then((response) => {
            console.log(response.data);
            if(isInTicket){
                ticketContext.loadTicket();
            }else{
                setAdded(false);
            }
        }).catch((error) => {
            console.log(error.response);
            Snackbar.show({
                text: 'No se pudo quitar la guía',
                duration: Snackbar.LENGTH_INDEFINITE,
                action: {
                  text: 'Cerrar',
                  textColor: 'red',
                  onPress: () => { /* Do something. */ },
                },
              });
        }).finally(() => {
            setLoading(false);
            setHasError(true);
        });
    }

    const addGuiaRemision = () => {
        setLoading(true);
        setHasError(false);
        api.post('/pesaje_guia_remision/store', {
            ticket_pesaje_id: ticketId,
            guia_remision_id: guiaRemision.id
        }).then((response) => {
            console.log("RECIBIDO", response.data);
            setAdded(true);
        }).catch((error) => {
            console.log(error.response);
        }).finally(() => {
            setLoading(false);
        });
    }

    return (
        <View style={{
            padding: 10, borderRadius: 10, marginVertical: 4,
            backgroundColor: "#fff",
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 3, 
        }}>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', }}>
            <View>
                <Text style={{ fontWeight: 'bold' }}>CODIGO: {guiaRemision.codigo}</Text>
                <Text>PLACA TRACTO: {guiaRemision.tracto?.placa}</Text>
                <Text>PLACA CARRETA: {guiaRemision.carreta?.placa}</Text>
            </View>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>{guiaRemision.fecha_desc}</Text>
            {
                added
                ? <IconButton
                    disabled={loading}
                    icon="delete"
                    iconColor='grey'
                    size={20}
                    onPress={deleteGuiaRemision}
                />
                : <IconButton
                    disabled={loading}
                    icon="plus"
                    iconColor='grey'
                    size={20}
                    onPress={addGuiaRemision}
                />
            }
        </View>
    </View>)
}
export default SimpleCard;
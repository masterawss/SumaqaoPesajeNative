import React, { useContext } from "react";
import { ActivityIndicator, Alert, View } from "react-native"
import { Button, IconButton, MD3Colors, Text } from "react-native-paper"
import { TicketContext } from "../../Show/provider/TicketProvider";
import api from "../../../../utils/axios";
import Snackbar from "react-native-snackbar";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SimpleCard = ({detalle, nro}: any) => {
    const { loading, hasError, loadTicket, ticketPesaje, deleteTicket } = useContext(TicketContext);
    const [loadingDelete, setLoadingDelete] = React.useState(false);

    const deleteData = () => {
        Alert.alert('Eliminar ticket', '¿Está seguro que desea eliminar el ticket?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                onPress: () => {
                    deleteDataConfirmed();
                }
            }
        ]);
    }

    const deleteDataConfirmed = async () => {
        setLoadingDelete(true);
        const user = await AsyncStorage.getItem('user');
        api.delete('/ticket_pesaje_detalle/'+detalle.id, {
            params: {
                deleted_user_id: JSON.parse(user || "")?.id
            }
        }).then((response) => {
            console.log(response.data);
            loadTicket();
        }).catch((error) => {
            console.log('ERROR', error.response.data);
            Snackbar.show({
                text: 'No se pudo crear el registro',
                duration: Snackbar.LENGTH_INDEFINITE,
                action: {
                  text: 'Cerrar',
                  textColor: 'red',
                  onPress: () => { /* Do something. */ },
                },
              });
        }).finally(() => {
            setLoadingDelete(false);
        });
    }

    return (
        <View style={{
            borderRadius: 10, marginVertical: 4,
            display: 'flex', flexDirection: 'row',
            backgroundColor: "#f5f5f5",
        }}>
            <View style={{ backgroundColor: '#7da82c', padding: 15, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>
                <Text style={{ color: 'white', fontSize: 15 }}>{nro}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '85%' }}>
                <View>
                    <Text style={{ fontWeight: 'bold', marginLeft: 20, fontSize: 16 }}>{detalle.peso_bruto} kg</Text>
                </View>
                {
                    loadingDelete ? <Text><ActivityIndicator color="grey" /></Text>
                    : <IconButton
                        disabled={loadingDelete}
                        icon="delete"
                        iconColor='grey'
                        size={20}
                        onPress={deleteData}
                    />
                }
            </View>
        </View>
    )
}

export default SimpleCard;
import React, { useContext } from "react";
import { ActivityIndicator, Alert, View } from "react-native"
import { Button, IconButton, MD3Colors, Text } from "react-native-paper"
import { TicketContext } from "../../Show/provider/TicketProvider";
import api from "../../../../utils/axios";
import Snackbar from "react-native-snackbar";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SimpleCard = ({detalle}: any) => {
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
            padding: 10, borderRadius: 10, marginVertical: 4,
            display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
            backgroundColor: "#f5f5f5",
        }}>
            <View>
                <Text style={{ fontWeight: 'bold' }}>{detalle.peso_bruto} kg</Text>
                {/* <Text>Peso bruto + paleta</Text> */}
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
    )
}

export default SimpleCard;
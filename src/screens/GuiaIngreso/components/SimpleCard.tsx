import { Alert, View } from 'react-native';
import { IconButton, Snackbar, Text } from 'react-native-paper';
import api from '../../../utils/axios';
import { useState } from 'react';

const SimpleCard = ({guiaIngreso}: any) => {

    const [loading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    const deleteGuiaIngreso = () => {
        Alert.alert('Quitar guia de ingreso', '¿Está seguro que desea quitar la guía de ingreso?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                onPress: () => {
                    deleteGuiaIngresoConfirmed();
                }
            }
        ]);
    }

    const deleteGuiaIngresoConfirmed = () => {
        setLoading(true);
        setHasError(false);
        api.delete('/pesaje_guia_ingreso/'+guiaIngreso.id).then((response) => {
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            setLoading(false);
            setHasError(true);
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
                <Text style={{ fontWeight: 'bold' }}>CODIGO</Text>
                <Text>PLACA</Text>
            </View>
            <View>
                <Text style={{ color: 'grey', fontSize: 12 }}>FECHA</Text>
            </View>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>Tipo de cacao</Text>
            <IconButton
                disabled={loading}
                icon="delete"
                iconColor='grey'
                size={20}
                onPress={deleteGuiaIngreso}
            />
        </View>
        <Snackbar
            visible={hasError}
            onDismiss={() => {setHasError(false)}}
        >
            No se pudo quitar la guía de ingreso
        </Snackbar>
    </View>)
}
export default SimpleCard;
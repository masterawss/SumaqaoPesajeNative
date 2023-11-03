import {View, Alert, ActivityIndicator} from 'react-native';
import { Appbar, Card, Text } from 'react-native-paper';

import SimpleCard from '../../components/Ticket/SimpleCard';
import GuiaIngreso from './components/GuiaIngreso';
import Pesaje from './components/Pesaje';
import api from '../../utils/axios';
import { useEffect, useState } from 'react';
import TabsSection from './Show/TabsSection';
import ErrorSection from '../../components/ErrorSection';

interface IIngreso {
    id: number;
    fecha: string;
    proveedor: string;
    tipo: string;
    numero: string;
    observaciones: string;
    estado: string;
    created_at: string;
    updated_at: string;
}

const ShowScreen = ({ navigation, route }: any) => {
    const { id } = route.params || { id: null };

    const [loading, setLoading] = useState(false);
    const [ingreso, setIngreso] = useState<IIngreso | null>(null);

    const [hasError, setHasError] = useState(false);

    useEffect(() => {
      loadIngreso();
    }, []);

    const loadIngreso = async () => {
    //   setLoading(true);
    //   api.get('/tickets/'+id).then((response) => {
    //       console.log(response.data);
    //       setIngreso(response.data);
    //   }).catch((error) => {
    //       console.log(error);
    //       setHasError(true);
    //   }).finally(() => {
    //     setLoading(false);
    //   });
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
      api.delete('/tickets/'+id).then((response) => {
          console.log(response.data);
          navigation.navigate('home');
      }).catch((error) => {
          console.log(error);
      }).finally(() => {
      });
    }

    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => {navigation.goBack()}} />
                <Appbar.Content title="Ticket de pesaje" />
                <Appbar.Action icon="pencil" onPress={() => {}} />
                <Appbar.Action icon="delete" onPress={deleteTicket} />
                <Appbar.Action icon="eye" onPress={() => navigation.navigate('pesaje.create')} />
            </Appbar.Header>
            <View style={{ paddingVertical: 10 }}>
              <SimpleCard />
            </View>
            {
              loading && <View><Text style={{ textAlign: 'center', marginTop: 150 }}><ActivityIndicator size="large" /></Text></View>
            }
            {
                !loading && hasError && 
                <ErrorSection message="No se pudo obtener los datos desde el servidor" 
                    onRetry={loadIngreso}
                />
            }
            {/* {
              !loading && !hasError && ingreso != null && <TabsSection ticketId={id} navigation={navigation} />
            } */}
            <TabsSection ticketId={id} navigation={navigation} />
        </>
    )
}

export default ShowScreen;
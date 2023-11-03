import {Appbar, Button, Text } from "react-native-paper";
import { View, ActivityIndicator } from "react-native";
import SimpleCard from "../../components/Ticket/SimpleCard";
import api from "../../utils/axios";
import React, { useEffect } from "react";
import ErrorSection from "../../components/ErrorSection";

const Index = ({navigation}: any) => {
    const [loading, setLoading] = React.useState(false);
    const [tickets, setTickets] = React.useState<any>([]);
    const [hasError, setHasError] = React.useState(false);


    const create = () => {
        navigation.navigate('ingreso.show')
    }

    const loadTickets = async () => {
        setTickets([{id: 1}, {id: 2}, {id: 3}])
        // setLoading(true);
        // api.get('/tickets').then((response) => {
        //     console.log(response.data);
        //     setTickets(response.data);
        // }
        // ).catch((error) => {
        //     setHasError(true);
        // }).finally(() => {
        //     setLoading(false);
        // });
    }

    useEffect(() => {
        loadTickets();
    }, [])

    return (
        <View style={{ padding: 10, minHeight: '100%' }}>
            <Appbar.Header>
                <Appbar.Content title="Tickets de pesaje" />
                <Appbar.Action icon="reload" onPress={loadTickets} />
            </Appbar.Header>
            {
                loading && <View><Text style={{ textAlign: 'center', marginTop: 150 }}><ActivityIndicator size="large" /></Text></View>
            }
            {
                !loading && !hasError && tickets.length == 0 && <Text>No hay tickets</Text>
            }
            {
                !loading && hasError && 
                <ErrorSection message="No se pudo obtener los datos desde el servidor" 
                    onRetry={loadTickets}
                />
            }
            {
                tickets.map((ticket: any) => <View key={ticket.id}  style={{ marginVertical: 5 }}><SimpleCard ticket={ticket} /></View> )
            }
            <Button style={{ position: 'absolute', bottom:0, right:0, margin: 10 }} mode="contained" onPress={create}>
                Crear ticket
            </Button>
        </View>
    )
}
export default Index;
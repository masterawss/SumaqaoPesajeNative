import {Appbar, Button, Text } from "react-native-paper";
import { View, ActivityIndicator, SafeAreaView, TouchableOpacity, ScrollView } from "react-native";
import SimpleCard from "../../components/Ticket/SimpleCard";
import api from "../../utils/axios";
import React, { useCallback, useEffect, useMemo } from "react";
import ErrorSection from "../../components/ErrorSection";
import BtnCreate from "./components/BtnCreate";
import DatePicker from "react-native-date-picker";

const Index = ({navigation}: any) => {
    const [loading, setLoading] = React.useState(false);
    const [tickets, setTickets] = React.useState<any>([]);
    const [hasError, setHasError] = React.useState(false);
    const [date, setDate] = React.useState(new Date());
    const [open, setOpen] = React.useState(false);
    
    const dateStr = useMemo(() => {
        let d = date.toLocaleString().split(',')[0];
        // Cambiar el formato de d/m/Y a Y-m-d
        let [day, month, year] = d.split('/');
        return `${year}-${month}-${day}`;
    }, [date]);

    const loadTickets = async () => {
        setLoading(true);
        setHasError(false);
        setTickets([]);
        // Restar 1 día a la fecha
        ;
        api.get('/ticket_pesaje', {
            params: {
                search: dateStr
            }
        }).then((response) => {
            // console.log(response.data);
            setTickets(response.data.ticket_pesajes);
        }
        ).catch((error) => {
            setHasError(true);
            console.log("ERROR", error.response);
        }).finally(() => {
            setLoading(false);
        });
    }

    useEffect(() => {
        loadTickets();
    }, [date])

    return (
        <SafeAreaView style={{ padding: 10, minHeight: '100%' }}>
            <Appbar.Header>
                <Appbar.Content title="Tickets de pesaje" />
                {/* <Appbar.Action icon="reload" onPress={loadTickets} /> */}
                <BtnCreate/>
            </Appbar.Header>
            <TouchableOpacity onPress={() => setOpen(true)} style={{ borderRadius: 100, backgroundColor: '#F1f1f1', paddingHorizontal: 20, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ textAlign: 'center', color: 'black' }}>Fecha: {dateStr}</Text>
                    <Button onPress={loadTickets} mode="contained" > Buscar</Button>
                </TouchableOpacity>
                <DatePicker modal open={open} mode="date" date={date}
                    onConfirm={(date) => {
                        setOpen(false)
                        setDate(date)
                    }}
                    onCancel={() => {
                        setOpen(false)
                    }}
                />

            {
                loading && <View><Text style={{ textAlign: 'center', marginTop: 150 }}><ActivityIndicator size="large" /></Text></View>
            }
            {
                !loading && hasError && 
                <ErrorSection message="No se pudo obtener los datos desde el servidor" 
                    onRetry={loadTickets}
                />
            }
            {
                !loading && !hasError && tickets.length == 0 && <View style={{ padding: 20}}>
                    <Text style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 10, marginTop: 10 }}>No hay tickets</Text>
                </View>
            }

            <ScrollView style={{ marginBottom: 120 }}>
                {
                    tickets.map((ticket: any) => <TouchableOpacity onPress={
                            () => navigation.navigate('ingreso.show' as never, {id: ticket.id} as never)
                        } key={ticket.id}  style={{ marginVertical: 5 }}>
                        <SimpleCard ticket={ticket} />
                    </TouchableOpacity> )
                }
            </ScrollView>
        </SafeAreaView>
    )
}
export default Index;
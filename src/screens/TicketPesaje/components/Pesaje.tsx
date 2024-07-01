import { ScrollView, View } from "react-native"
import { Text } from "react-native-paper"
import TaraSection from "./Pesaje/TaraSection";
import SimpleCard from "./Pesaje/SimpleCard";
import React, { useContext, useMemo } from "react";
import PesajeCreateSection from "./Pesaje/PesajeCreateSection";
import { TicketContext } from "../Show/provider/TicketProvider";
import BalanzaBluetoothProvider from "../context/BalanzaBluetoothProvider";

const Pesaje = () => {
    const { loading, hasError, loadTicket, ticketPesaje, deleteTicket } = useContext(TicketContext);

    const [items, setItems] = React.useState([
        {id: 1, peso: 98, fecha: '2021-09-01'},
        {id: 2, peso: 98, fecha: '2021-09-01'},
        {id: 3, peso: 98, fecha: '2021-09-01'},
    ])
    // Agrupar por el campo cdigo
    const ticketPesajeGroup = useMemo(() => {
        const group: any = {};
        ticketPesaje.detalle.forEach((item: any) => {
            const code = item.g_r_cod !== null && item.g_r_cod !== '' ? item.g_r_cod : '()';
            if (!group[code]) {
                group[code] = [];
            }
            group[code].push(item);
        });
        return group
    }, [ticketPesaje.detalle])

    const ticketPesajeGroupKeys = useMemo(() => {
        return Object.keys(ticketPesajeGroup)
    }, [ticketPesajeGroup])

    return (<BalanzaBluetoothProvider>
        <View style={{ padding: 10, paddingTop: 0 }}>
            <TaraSection />
            <PesajeCreateSection />
            <Text style={{ marginVertical: 10, fontWeight: 'bold', color: 'grey' }}>Lista de pesaje</Text>
            {
                ticketPesajeGroupKeys.map((key) => <View key={key}>
                    <Text style={{ marginVertical: 10, fontWeight: 'bold', color: 'grey' }}>{key}</Text>
                    {
                        ticketPesajeGroup[key].map((item: any, index: number) => <SimpleCard key={item.id} nro={index+1} detalle={item} />)
                    }
                </View>)
            }
        </View>
    </BalanzaBluetoothProvider>)
}

export default Pesaje;
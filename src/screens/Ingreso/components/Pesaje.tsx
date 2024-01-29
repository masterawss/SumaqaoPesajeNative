import { ScrollView, View } from "react-native"
import { Text } from "react-native-paper"
import TaraSection from "./Pesaje/TaraSection";
import SimpleCard from "./Pesaje/SimpleCard";
import React, { useContext } from "react";
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
    const saveData = (data: any) => {
        console.log('saveData', data)
        setItems([...items, {id: items.length + 1, peso: data, fecha: '2021-09-01'}])
    }
    return (<BalanzaBluetoothProvider>
        <View style={{ padding: 10, paddingTop: 0 }}>
            <TaraSection />
            <PesajeCreateSection />
            <Text style={{ marginVertical: 10, fontWeight: 'bold', color: 'grey' }}>Lista de pesaje</Text>
            {
                ticketPesaje.detalle.map((item, index) => (
                    <SimpleCard key={item.id} nro={index+1} detalle={item} />
                ))
            }
        </View>
        {/* <AddPesajeSection onSaved={saveData} /> */}
    </BalanzaBluetoothProvider>)
}

export default Pesaje;
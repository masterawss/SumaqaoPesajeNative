import { View } from "react-native"
import { Text } from "react-native-paper"
import TaraSection from "./Pesaje/TaraSection";
import SimpleCard from "./Pesaje/SimpleCard";
import AddPesajeSection from "./Pesaje/AddPesajeSection";
import React, { useContext } from "react";
import PesajeCreateSection from "./Pesaje/PesajeCreateSection";
import { TicketContext } from "../Show/provider/TicketProvider";

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
    return (<View>
        <View style={{ padding: 10 }}>
            <TaraSection />
            <PesajeCreateSection />
            <Text style={{ marginVertical: 10, fontWeight: 'bold', color: 'grey' }}>Lista de pesaje</Text>
            {
                ticketPesaje.detalle.map((item) => (
                    <SimpleCard key={item.id} detalle={item} />
                ))
            }
        </View>
        {/* <AddPesajeSection onSaved={saveData} /> */}
    </View>)
}

export default Pesaje;
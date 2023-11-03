import { View } from "react-native"
import { Button, Text } from "react-native-paper"
import TaraSection from "./Pesaje/TaraSection";
import SimpleCard from "./Pesaje/SimpleCard";
import AddPesajeSection from "./Pesaje/AddPesajeSection";
import React from "react";

const Pesaje = ({ navigation } : any) => {
    const [items, setItems] = React.useState([
        {id: 1, peso: 98, fecha: '2021-09-01'},
        {id: 2, peso: 98, fecha: '2021-09-01'},
        {id: 3, peso: 98, fecha: '2021-09-01'},
    ])
    const saveData = (data: any) => {
        console.log('saveData', data)
        setItems([...items, {id: items.length + 1, peso: data, fecha: '2021-09-01'}])
    }
    return (<>
        <View style={{ padding: 10 }}>
            <TaraSection />
            <Text style={{ marginVertical: 10, fontWeight: 'bold', color: 'grey' }}>Lista de pesaje</Text>
            {
                items.map((item) => (
                    <SimpleCard key={item.id} />
                ))
            }

        </View>
        <AddPesajeSection onSaved={saveData} />
    </>)
}

export default Pesaje;
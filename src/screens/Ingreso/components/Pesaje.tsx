import { View } from "react-native"
import { Button, Text } from "react-native-paper"
import TaraSection from "./Pesaje/TaraSection";
import SimpleCard from "./Pesaje/SimpleCard";
import AddPesajeSection from "./Pesaje/AddPesajeSection";

const Pesaje = ({ navigation } : any) => {
    return (<>
    <View style={{ padding: 10 }}>
        <TaraSection />
        <Text style={{ marginVertical: 10, fontWeight: 'bold', color: 'grey' }}>Lista de pesaje</Text>

        <SimpleCard />
        <SimpleCard />
        <SimpleCard />

    </View>
    <AddPesajeSection />
    </>)
}

export default Pesaje;
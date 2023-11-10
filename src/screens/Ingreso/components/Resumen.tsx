import {View} from 'react-native'
import { Text } from 'react-native-paper';
const Resumen = ({ticketPesaje}: any) => {
    return <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', color: 'grey' }}>Kg bruto</Text>
            <Text>{ticketPesaje.peso_bruto}</Text>
        </View>
    </View>
}

export default Resumen;
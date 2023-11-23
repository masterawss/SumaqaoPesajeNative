import {View} from 'react-native'
import { Icon, IconButton, Text } from 'react-native-paper'

const DesactivadoSection = ({loading, checkBluetoothEnabled}: any) => {
    return <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
    <View>
        <Icon source="bluetooth-off" size={30} />
        <View>
            <Text style={{ marginLeft: 10, fontWeight: 'bold' }}>Bluetooth desactivado</Text>
            <Text style={{ marginLeft: 10 }}>Active su bluetooth para conectarse con la balanza</Text>
        </View>
    </View>
    <IconButton disabled={loading} iconColor='grey' size={20} icon="sync" onPress={checkBluetoothEnabled} />
</View>
}

export default DesactivadoSection
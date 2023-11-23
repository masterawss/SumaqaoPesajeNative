import {View} from 'react-native'
import { Button, Icon, Text } from 'react-native-paper'
const NotFoundSection = ({connectToDevice}: any) => {
    return <View style={{ display: 'flex', flexDirection: 'row',  justifyContent: 'space-between', alignItems: 'center', }}>
    <View>
        <Icon source="bluetooth-off" size={40} />
        <View>
            <Text style={{ marginLeft: 10, marginTop: 10, fontWeight: 'bold' }}>Balanza no conectada</Text>
            <Text style={{ marginLeft: 10 }}>No se pudo encontrar la balanza</Text>
        </View>
    </View>
    <Button mode="outlined" onPress={connectToDevice}>
        Conectar
    </Button>
</View>
}
export default NotFoundSection
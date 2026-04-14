import { Text, View } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AppIconButton from '../ui/AppIconButton';
import AppSurface from '../ui/AppSurface';

const DesactivadoSection = ({loading, checkBluetoothEnabled}: any) => {
    return <AppSurface style={{ padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <MaterialCommunityIcons name="bluetooth-off" size={24} color="#6B7280" />
            <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={{ color: '#111827', fontWeight: '700' }}>Bluetooth desactivado</Text>
                <Text style={{ color: '#6B7280', marginTop: 2 }}>Activa Bluetooth para conectarte con la balanza.</Text>
            </View>
        </View>
        <AppIconButton disabled={loading} color="#6B7280" size={20} icon="refresh" onPress={checkBluetoothEnabled} />
    </AppSurface>
}

export default DesactivadoSection

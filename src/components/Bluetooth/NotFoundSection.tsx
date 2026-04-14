import { Text, View } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AppButton from '../ui/AppButton';
import AppSurface from '../ui/AppSurface';

const NotFoundSection = ({connectToDevice}: any) => {
    return <AppSurface style={{ padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <MaterialCommunityIcons name="bluetooth-off" size={26} color="#6B7280" />
            <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={{ color: '#111827', fontWeight: '700' }}>Balanza no conectada</Text>
                <Text style={{ color: '#6B7280', marginTop: 2 }}>No se pudo encontrar la balanza seleccionada.</Text>
            </View>
        </View>
        <AppButton compact variant="secondary" onPress={connectToDevice}>
            Conectar
        </AppButton>
    </AppSurface>
}
export default NotFoundSection

import { useContext, useState } from "react";
import { ActivityIndicator, Text } from "react-native-paper"
import { BalanzaBluetoothContext } from "../../../context/BalanzaBluetoothProvider";
import DesactivadoSection from "../../../../../components/Bluetooth/DesactivadoSection";
import NotFoundSection from "../../../../../components/Bluetooth/NotFoundSection";
import { Button, Icon, IconButton, TextInput } from "react-native-paper";
import { View } from "react-native";

const BluetoothSection = ({ setVisible, ticketPesaje, loadTicket,
    bluetoothEnabled,
    loading,
    device,
    peso,
    connectToDevice,
    checkBluetoothEnabled,
}: any) => {

    const [loadingSave, setLoadingSave] = useState(false);

    const onPress = () => {
        setVisible(false);
    }

    return <>
        {
            loading && <Text><ActivityIndicator size="small" /> Cargando ...</Text>
        }
        {
            !bluetoothEnabled && <DesactivadoSection loading={loading} checkBluetoothEnabled={checkBluetoothEnabled} />
        }
        {
            bluetoothEnabled && !device && <NotFoundSection connectToDevice={connectToDevice} />
        }
        {
            !!device && <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <Icon source="bluetooth" size={30} />
                    <Text style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 20 }}>{peso} Kg</Text>
                </View>
                <Button mode="contained" onPress={onPress} loading={loadingSave}>
                    Guardar
                </Button>
            </View>
        }
    </>
}
export default BluetoothSection;
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {useState} from 'react'
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import { requestBluetoothPermissions } from "../../utils/androidBluetoothPermissions";
import AppButton from "../../components/ui/AppButton";

const Create = () => {
      const insets = useSafeAreaInsets();
      const [discovering, setDiscovering] = useState(false)
      const [devices, setDevices] = useState<any>([])
      const [data, setData] = useState<any>(null)
      const startDiscovery = async () => {
        try {
            const hasPermissions = await requestBluetoothPermissions({
                scan: true,
                connect: true,
                title: 'Se requieren permisos de Bluetooth',
                message: 'Debemos permitir el acceso para buscar dispositivos Bluetooth.',
            });
            if (!hasPermissions) {
                return;
            }
            const unpaired = await RNBluetoothClassic.startDiscovery();
            setDevices(unpaired)
            // const con = await unpaired[0].connect({})
            // console.log('CON', con)
            // const read = await unpaired[0].read()
            // console.log('READ', read)

            } catch (err) {
                console.error((err as any)?.message)
            }
      }

      const connectToDevice = async (device: any) => {
        // await RNBluetoothClassic.accept({});
        // const dev = await RNBluetoothClassic.accept({});
        try {
            const hasPermissions = await requestBluetoothPermissions({
                connect: true,
                title: 'Se requieren permisos de Bluetooth',
                message: 'Debemos permitir el acceso para conectarnos con el dispositivo Bluetooth.',
            });
            if (!hasPermissions) {
                return;
            }
            // const dev = await RNBluetoothClassic.getConnectedDevice(device.address);
            // const dev = await RNBluetoothClassic.connectToDevice(device.address)
            // console.log(dev)
            const con = await device.connect({})
            console.log('CON', con)
            // const read = await device.read()
            // console.log('READ', read)
            device.onDataReceived((data: any) => {
                console.log('DaTA', data)
                setData(data)
            })

            
        } catch (error) {
            console.error('ERROR', error)
        }

        

        // try {
        //     const paired = await RNBluetoothClassic.pairDevice(device.address)
        //     console.log('PAIRED', paired)

        // } catch (error) {
        //     console.log('Error', error)
        // }

      }

    return <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
            <AppButton icon="bluetooth-searching" onPress={startDiscovery}>
                Buscar
            </AppButton>
            {
                devices.map(
                    (device : any, id: any) => {
                        return <View key={id}>
                            <Text>{device.name}</Text>
                            <Text>{device.address}</Text>
                            <AppButton icon="bluetooth-connect" onPress={()=>connectToDevice(device)}>
                                Conectar
                            </AppButton>
                        </View>
                    }
                )
            }

            <Text style={{marginBottom: 20, fontWeight: 'bold'}}>DATA</Text>
            <Text>-{data.data}-</Text>
        </View>
}
export default Create

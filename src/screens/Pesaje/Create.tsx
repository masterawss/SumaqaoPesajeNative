import { Button, Text } from "react-native-paper";
import {View, PermissionsAndroid} from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import {useState} from 'react'
import RNBluetoothClassic from 'react-native-bluetooth-classic';

const Create = () => {
      const [discovering, setDiscovering] = useState(false)
      const [devices, setDevices] = useState<any>([])
      const [data, setData] = useState<any>(null)
      const startDiscovery = async () => {
        try {
            await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                  title: 'Access fine location required for discovery',
                  message:
                    'In order to perform discovery, you must enable/allow ' +
                    'fine location access.',
                  buttonNeutral: 'Ask Me Later"',
                  buttonNegative: 'Cancel',
                  buttonPositive: 'OK'
                }
              );
            const unpaired = await RNBluetoothClassic.startDiscovery();
            setDevices(unpaired)
            // const con = await unpaired[0].connect({})
            // console.log('CON', con)
            // const read = await unpaired[0].read()
            // console.log('READ', read)

            } catch (err) {
                console.error(err?.message)
            }
      }

      const connectToDevice = async (device) => {
        // await RNBluetoothClassic.accept({});
        // const dev = await RNBluetoothClassic.accept({});
        try {
            // const dev = await RNBluetoothClassic.getConnectedDevice(device.address);
            // const dev = await RNBluetoothClassic.connectToDevice(device.address)
            // console.log(dev)
            const con = await device.connect({})
            console.log('CON', con)
            // const read = await device.read()
            // console.log('READ', read)
            device.onDataReceived((data) => {
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

    return <SafeAreaView>
            <Button icon="camera" mode="contained" onPress={startDiscovery}>
                Buscar
            </Button>
            {
                devices.map(
                    (device : any, id: any) => {
                        return <View key={id}>
                            <Text>{device.name}</Text>
                            <Text>{device.address}</Text>
                            <Button icon="camera" mode="contained" onPress={()=>connectToDevice(device)}>
                                Conectar
                            </Button>
                        </View>
                    }
                )
            }

            <Text style={{marginBottom: 20, fontWeight: 'bold'}}>DATA</Text>
            <Text>-{data.data}-</Text>
        </SafeAreaView>
}
export default Create
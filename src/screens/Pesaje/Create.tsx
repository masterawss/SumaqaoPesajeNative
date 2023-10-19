import { ScrollView, Text, View } from "react-native"
import { Appbar } from "react-native-paper"
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import { useEffect, useState } from "react";

const Create = ({navigation}: any) => {
    const [connectedList ,setConnectedList] = useState<any>();
    const [device, setDevice] = useState<any>();
    const [data, setData] = useState<any>();

    useEffect(() => {
        getConnectedDevices()
    }, [])

    useEffect(() => {
        console.log('connectedList', connectedList)
        if(connectedList.length){
            connectToDevice(connectedList[0].id)
        }
    }, [connectedList])

    const getConnectedDevices = async () => {
        try {
            const connected = await RNBluetoothClassic.getConnectedDevices();
            console.log('connected', connected)
            setConnectedList(connected);
        } catch (err) {
            // Error if Bluetooth is not enabled
            // Or there are any issues requesting paired devices
            console.log("ERORRRRR", err);
        }
    }

    const connectToDevice = async ({address}: any) => {
        const device = await RNBluetoothClassic.getConnectedDevice(address);
        setDevice(device)
    }


    const onReceivedData = async (event:any) => {
        console.log('DATA RECEIVED', event)
        setData({
            ...event,
            timestamp: new Date(),  // Add the current date
            type: 'receive'         // Add a type for UI
        });
      }
    useEffect(() => {
        if(device){
            device.onDataReceived((data: any) => onReceivedData(data))
        }
    }, [device])

    return (
        <ScrollView>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => {navigation.goBack()}} />
                <Appbar.Content title="BLUETOOTH" />
            </Appbar.Header>
            <View>
                <Text style={{ color: 'black' }}>
                    {JSON.stringify(connectedList, null, 2)}
                </Text>
                <Text style={{ color: 'black' }}>
                    {JSON.stringify(data, null, 2)}
                </Text>
            </View>
        </ScrollView>
    )
}

export default Create
import { ScrollView, Text, View } from "react-native"
import { Appbar } from "react-native-paper"
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import { useEffect, useState } from "react";

import BleManager from 'react-native-ble-manager'

const Create = ({navigation}: any) => {
    const peripherals = new Map()
 const [connectedDevices, setConnectedDevices] = useState([]);

  const handleGetConnectedDevices = () => {
    BleManager.getConnectedPeripherals([]).then(results => {
      if (results.length === 0) {
        console.log('No connected bluetooth devices');
      } else {
        for (let i = 0; i < results.length; i++) {
          let peripheral = results[i];
          peripheral.connected = true;
          peripherals.set(peripheral.id, peripheral);
          setConnectedDevices(Array.from(peripherals.values()));
        }
      }
    });
  };

  useEffect(() => {
    BleManager.start({showAlert: false}).then(() => {
      console.log('BleManager initialized');
      handleGetConnectedDevices();
    });
  }, []);

    return (
        <ScrollView>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => {navigation.goBack()}} />
                <Appbar.Content title="BLUETOOTH" />
            </Appbar.Header>
            <View>
                <Text>{JSON.stringify(connectedDevices)}</Text>
            </View>
        </ScrollView>
    )
}

export default Create
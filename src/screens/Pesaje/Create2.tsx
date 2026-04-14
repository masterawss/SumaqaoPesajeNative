import { ScrollView, Text, View } from "react-native"
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import { useEffect, useState } from "react";

import BleManager from 'react-native-ble-manager'
import AppIconButton from "../../components/ui/AppIconButton";

const Create = ({navigation}: any) => {
    const peripherals = new Map()
 const [connectedDevices, setConnectedDevices] = useState<any[]>([]);

  const handleGetConnectedDevices = () => {
    BleManager.getConnectedPeripherals([]).then((results: any[]) => {
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
            <View style={{ minHeight: 64, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#E5E7EB" }}>
                <AppIconButton icon="chevron-left" onPress={() => {navigation.goBack()}} />
                <Text style={{ color: "#111827", fontSize: 18, fontWeight: "800", marginLeft: 6 }}>BLUETOOTH</Text>
            </View>
            <View>
                <Text>{JSON.stringify(connectedDevices)}</Text>
            </View>
        </ScrollView>
    )
}

export default Create

import React from "react";
import { View } from "react-native"
import { Switch, Text } from "react-native-paper";
import BluetoothSection from "./PesajeCreateSection/BluetoothSection";
import ManualSection from "./PesajeCreateSection/ManualSection";

const PesajeCreateSection = () => {
    const [isBluetooth, setIsBluetooth] = React.useState(true);

    return <>
        <View style={{
                padding: 10, borderRadius: 10, marginVertical: 4,
                backgroundColor: "#fff",
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: 0.22,
                shadowRadius: 2.22,
                elevation: 3,
            }}>
                <View style={{ display: 'flex', marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                    <Text style={{ fontWeight: 'bold' }}>Registro de pesaje</Text>

                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                        <Text style={{ color: 'grey', marginRight: 10 }}>{isBluetooth ? 'Bluetooth' : 'Manual'}</Text>
                        <Switch value={isBluetooth} onValueChange={() => setIsBluetooth(val => !val)} />
                    </View>
                </View>

                {
                    isBluetooth ? <BluetoothSection /> : <ManualSection />
                }
        </View>
    </>
}

export default PesajeCreateSection;
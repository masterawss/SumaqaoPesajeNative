import React, { ReactNode, createContext, useEffect } from "react";
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import { Button, Icon, IconButton, Text } from "react-native-paper";
import { ActivityIndicator, PermissionsAndroid, View } from "react-native";
import Snackbar from "react-native-snackbar";

export const BalanzaBluetoothContext = createContext<any | null>(null);

const BalanzaBluetoothProvider = ({children}: {children: ReactNode}) => {
    const [loading, setLoading] = React.useState(false);
    const [bluetoothEnabled, setBluetoothEnabled] = React.useState(false);
    const [device, setDevice] = React.useState<any>(null)
    const [peso, setPeso] = React.useState<any>(null)

    useEffect(() => {
        checkBluetoothEnabled()
    }, [])

    useEffect(() => {
        if(bluetoothEnabled)
            connectToDevice()
    }, [bluetoothEnabled])

    const checkBluetoothEnabled = async () => {
        setLoading(false);
        setBluetoothEnabled(true);
    }

    const connectToDevice = async () => {
        setDevice({
            name: 'Balanza',
            address: '00:08:F4:02:BC:F9'
        })
        setTimeout(() => {
            setPeso(Math.random() * 100);
        }, 1000);
    }

    return <BalanzaBluetoothContext.Provider value={{
        bluetoothEnabled,
        loading,
        device,
        peso,
        connectToDevice,
        checkBluetoothEnabled
    }}>
        {children}
    </BalanzaBluetoothContext.Provider>
}

export default BalanzaBluetoothProvider

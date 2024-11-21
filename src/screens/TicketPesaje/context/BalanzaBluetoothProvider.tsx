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
        setLoading(true);
        const enabled = await RNBluetoothClassic.isBluetoothEnabled();
        setBluetoothEnabled(enabled);
        setLoading(false);
    }

    const connectToDevice = async () => {
        setLoading(true)
        await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Se requiere permiso de acceso a la ubicación',
              message:
                'Debemos permitir el acceso para conectarnos con la balanza ',
              buttonNeutral: 'Preguntarme luego',
              buttonNegative: 'Cancelar',
              buttonPositive: 'OK'
            }
          );
        await PermissionsAndroid.request(
             PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
             {
                title: 'Se requiere permiso de acceso a la ubicación',
                message:
                  'Debemos permitir el acceso para conectarnos con la balanza ',
                buttonNeutral: 'Preguntarme luego',
                buttonNegative: 'Cancelar',
                buttonPositive: 'OK'
              }
        );

        try {
            const address = '00:08:F4:02:BC:F9';
            // const device = await RNBluetoothClassic.getConnectedDevice(address);
            const paired = await RNBluetoothClassic.getBondedDevices();
            const device = paired.find(d => d.address === address)
            console.log('DEVIVE', device)
            const con = await device.connect({})
            setDevice(con)
            device.onDataReceived((data) => {
                // Eliminar los caracteres no numericos
                // let peso = data.data.replace(/[^0-9]/g, '')
                let peso = data.data.substring(0, data.data.length - 3)
                // console.log(data)
                setPeso(peso)
            })
        } catch (error) {
            console.log('ERROR', error)
            Snackbar.show({
                text: 'No se pudo conectar con la balanza',
                // text: JSON.stringify(error),
                duration: Snackbar.LENGTH_INDEFINITE,
                action: {
                  text: 'Cerrar',
                  textColor: 'red',
                  onPress: () => { /* Do something. */ },
                },
            });
        } finally {
            setLoading(false)
        }
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

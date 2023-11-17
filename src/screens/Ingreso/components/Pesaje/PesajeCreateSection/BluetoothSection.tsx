import React, { useEffect } from "react";
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import { Button, Icon, IconButton, Text } from "react-native-paper";
import { ActivityIndicator, PermissionsAndroid, View } from "react-native";
import Snackbar from "react-native-snackbar";
import savePesoHook from "./hook/savePesoHook";

const BluetoothSection = () => {
    const [loading, setLoading] = React.useState(false);
    const [bluetoothEnabled, setBluetoothEnabled] = React.useState(false);
    const [device, setDevice] = React.useState<any>(null)
    const [peso, setPeso] = React.useState<any>(null)
    const {loading: loadingSave, error, saveData} = savePesoHook()

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
            const address = '00:08:F4:02:BC:F5';
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

    const save = () => {
        saveData(peso, true)
    }

    return <>
        {
            loading && <Text><ActivityIndicator size="small" /> Cargando ...</Text>
        }
        {
            !bluetoothEnabled && <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                <View>
                    <Icon source="bluetooth-off" size={30} />
                    <View>
                        <Text style={{ marginLeft: 10, fontWeight: 'bold' }}>Bluetooth desactivado</Text>
                        <Text style={{ marginLeft: 10 }}>Active su bluetooth para conectarse con la balanza</Text>
                    </View>
                </View>
                <IconButton disabled={loading} iconColor='grey' size={20} icon="sync" onPress={checkBluetoothEnabled} />
            </View>
        }
        {
            bluetoothEnabled && !device && <View style={{ display: 'flex', flexDirection: 'row',  justifyContent: 'space-between', alignItems: 'center', }}>
                <View>
                    <Icon source="bluetooth-off" size={40} />
                    <View>
                        <Text style={{ marginLeft: 10, marginTop: 10, fontWeight: 'bold' }}>Balanza no conectada</Text>
                        <Text style={{ marginLeft: 10 }}>No se pudo encontrar la balanza</Text>
                    </View>
                </View>
                <Button mode="outlined" onPress={connectToDevice}>
                    Conectar
                </Button>
            </View>
        }
        {
            !!device && <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <Icon source="bluetooth" size={30} />
                    <Text style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 20 }}>{peso} Kg</Text>
                </View>
                <Button mode="contained" onPress={save}>
                    Guardar
                </Button>
            </View>
        }
    </>
}

export default BluetoothSection;
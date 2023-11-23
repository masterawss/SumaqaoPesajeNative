import React, { useContext, useEffect } from "react";
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import { Button, Icon, IconButton, Text } from "react-native-paper";
import { ActivityIndicator, PermissionsAndroid, View } from "react-native";
import Snackbar from "react-native-snackbar";
import savePesoHook from "./hook/savePesoHook";
import { BalanzaBluetoothContext } from "../../../context/BalanzaBluetoothProvider";

const BluetoothSection = () => {

    const {bluetoothEnabled, loading, device, peso, connectToDevice, checkBluetoothEnabled} = useContext(BalanzaBluetoothContext);

    const {loading: loadingSave, error, saveData} = savePesoHook()

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
                <Button mode="contained" onPress={save} loading={loadingSave}>
                    Guardar
                </Button>
            </View>
        }
    </>
}

export default BluetoothSection;
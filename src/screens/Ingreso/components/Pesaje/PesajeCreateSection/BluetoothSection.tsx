import React, { useContext, useEffect } from "react";
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import { Button, Icon, IconButton, Text } from "react-native-paper";
import { ActivityIndicator, PermissionsAndroid, View } from "react-native";
import Snackbar from "react-native-snackbar";
import savePesoHook from "./hook/savePesoHook";
import { BalanzaBluetoothContext } from "../../../context/BalanzaBluetoothProvider";
import DesactivadoSection from "../../../../../components/Bluetooth/DesactivadoSection";
import NotFoundSection from "../../../../../components/Bluetooth/NotFoundSection";

const BluetoothSection = () => {

    const {bluetoothEnabled, loading, device, peso, connectToDevice, checkBluetoothEnabled} = useContext(BalanzaBluetoothContext);

    const {loading: loadingSave, error, saveData} = savePesoHook()
    const [pesoEstable, setPesoEstable] = React.useState<number | null>(null);

    const save = () => {
        saveData(peso, true)
    }

    useEffect(() => {
        // Verifica si el peso se ha mantenido sin cambios durante 10 segundos
        const timeoutId = setTimeout(() => {
          if (peso !== null && peso === pesoEstable) {
            console.log(`El peso se ha mantenido estable durante 10 segundos: ${peso}`);
            // Agrega aquí la lógica que deseas ejecutar cuando el peso se estabiliza
          }
        }, 10000); // 10 segundos en milisegundos
        return () => clearTimeout(timeoutId);
    }, [peso, pesoEstable]);

    useEffect(() => {
        // Actualiza el valor de pesoEstable cuando el peso cambia
        setPesoEstable(peso);
    }, [peso]);

    const [cronometro, setCronometro] = React.useState(10);
    useEffect(() => {
        const cronometroInterval = setInterval(() => {
          setCronometro((prevCronometro) => prevCronometro - 1);
        }, 1000);

        // Reinicia el cronómetro cuando el peso cambia
        if (peso !== pesoEstable) {
          setCronometro(10);
        }

        return () => clearInterval(cronometroInterval);
    }, [peso, pesoEstable]);

    useEffect(() => {
        if (cronometro === 0) {
            save()
        }
    }, [cronometro]);

    return <>
        {
            loading && <Text><ActivityIndicator size="small" /> Cargando ...</Text>
        }
        {
            !bluetoothEnabled && <DesactivadoSection loading={loading} checkBluetoothEnabled={checkBluetoothEnabled} />
        }
        {
            bluetoothEnabled && !device && <NotFoundSection connectToDevice={connectToDevice} />
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
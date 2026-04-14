import React, { ReactNode, createContext, useCallback, useEffect } from "react";
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import { requestBluetoothPermissions } from "../../../utils/androidBluetoothPermissions";
import { getStoredActiveBalanza } from "../../../utils/balanzasStorage";

export const BalanzaBluetoothContext = createContext<any | null>(null);
const Snackbar = require("react-native-snackbar");

const BalanzaBluetoothProvider = ({children}: {children: ReactNode}) => {
    const [loading, setLoading] = React.useState(false);
    const [bluetoothEnabled, setBluetoothEnabled] = React.useState(false);
    const [device, setDevice] = React.useState<any>(null);
    const [peso, setPeso] = React.useState<any>(null);
    const [activeBalanza, setActiveBalanza] = React.useState<any>(null);
    const [ready, setReady] = React.useState(false);

    useEffect(() => {
        loadActiveBalanza().finally(() => {
            setReady(true);
        });
    }, [loadActiveBalanza]);

    useEffect(() => {
        if (ready) {
            checkBluetoothEnabled();
        }
    }, [ready]);

    const loadActiveBalanza = useCallback(async () => {
        const balanza = await getStoredActiveBalanza();
        setActiveBalanza(balanza);
        return balanza;
    }, []);

    const connectToDevice = useCallback(async () => {
        if (!activeBalanza?.address) {
            Snackbar.show({
                text: 'Selecciona una balanza antes de conectar.',
                duration: Snackbar.LENGTH_SHORT,
            });
            return;
        }

        setLoading(true)
        const hasPermissions = await requestBluetoothPermissions({
            connect: true,
            title: 'Se requieren permisos de Bluetooth',
            message: 'Debemos permitir el acceso para conectarnos con la balanza.',
        });
        if (!hasPermissions) {
            setLoading(false)
            return;
        }

        try {
            const paired = await RNBluetoothClassic.getBondedDevices();
            const pairedDevice = paired.find(d => d.address === activeBalanza.address)
            if (!pairedDevice) {
                throw new Error('No se encontró la balanza vinculada.')
            }
            const connectedDevice = await pairedDevice.connect({})
            setDevice(connectedDevice)
            pairedDevice.onDataReceived((data) => {
                const nextPeso = data.data.substring(0, data.data.length - 3)
                setPeso(nextPeso)
            })
        } catch (error) {
            setDevice(null);
            Snackbar.show({
                text: 'No se pudo conectar con la balanza',
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
    }, [activeBalanza?.address]);

    useEffect(() => {
        setDevice(null);
        setPeso(null);

        if (bluetoothEnabled && activeBalanza?.address) {
            connectToDevice();
        }
    }, [activeBalanza?.address, bluetoothEnabled, connectToDevice]);

    const checkBluetoothEnabled = async () => {
        setLoading(true);
        const enabled = await RNBluetoothClassic.isBluetoothEnabled();
        setBluetoothEnabled(enabled);
        setLoading(false);
    }

    return <BalanzaBluetoothContext.Provider value={{
        bluetoothEnabled,
        loading,
        device,
        peso,
        activeBalanza,
        connectToDevice,
        checkBluetoothEnabled,
        loadActiveBalanza,
    }}>
        {children}
    </BalanzaBluetoothContext.Provider>
}

export default BalanzaBluetoothProvider

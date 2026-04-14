import React, { ReactNode, createContext, useCallback, useEffect } from "react";
import { getStoredActiveBalanza } from "../../../utils/balanzasStorage";

export const BalanzaBluetoothContext = createContext<any | null>(null);

const BalanzaBluetoothProvider = ({children}: {children: ReactNode}) => {
    const [loading, setLoading] = React.useState(false);
    const [bluetoothEnabled, setBluetoothEnabled] = React.useState(false);
    const [device, setDevice] = React.useState<any>(null);
    const [peso, setPeso] = React.useState<any>(null);
    const [activeBalanza, setActiveBalanza] = React.useState<any>(null);

    useEffect(() => {
        loadActiveBalanza();
        checkBluetoothEnabled()
    }, [])

    const loadActiveBalanza = async () => {
        const balanza = await getStoredActiveBalanza();
        setActiveBalanza(balanza);
        return balanza;
    }

    const connectToDevice = useCallback(async () => {
        if (!activeBalanza?.address) {
            return;
        }

        setDevice({
            name: activeBalanza.title,
            address: activeBalanza.address
        })
        setTimeout(() => {
            setPeso(Math.random() * 100);
        }, 1000);
    }, [activeBalanza?.address, activeBalanza?.title]);

    useEffect(() => {
        if(bluetoothEnabled && activeBalanza?.address)
            connectToDevice()
    }, [activeBalanza?.address, bluetoothEnabled, connectToDevice])

    const checkBluetoothEnabled = async () => {
        setLoading(false);
        setBluetoothEnabled(true);
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

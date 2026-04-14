import React, { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import RNBluetoothClassic from 'react-native-bluetooth-classic';

import BalanceImg from '../../../../../assets/img/balance.png';
import { requestBluetoothPermissions } from "../../../../utils/androidBluetoothPermissions";
import AppButton from "../../../../components/ui/AppButton";
import AppModalSheet from "../../../../components/ui/AppModalSheet";

const AddPesajeSection = ({onSaved = (data: number) => {}}) => {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [visible, setVisible] = React.useState(false);
    const [peso, setPeso] = React.useState(0);

    const save = () => {
        console.log('save')
        onSaved(1)
        setVisible(false)
    }

    useEffect(() => {
        connectToDevice()
    }, [])

    const connectToDevice = async () => {
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
            const address = '00:08:F4:02:BC:F9';
            const paired = await RNBluetoothClassic.getBondedDevices();
            const device = paired.find(d => d.address === address)
            if (!device) {
                throw new Error('No se encontró la balanza vinculada.')
            }
            const con = await device.connect({})
            console.log('CON', con)
            device.onDataReceived((data) => {
                console.log(data)
                setPeso(data.data as unknown as number)
            })
            setError(false)
        } catch (error) {
            console.log('ERROR EN CONEXION', error)
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <AppButton style={{ position: 'absolute', bottom:0, right:0, margin: 10 }} onPress={() => setVisible(true)}>
                Agregar pesaje
            </AppButton>
            <AppModalSheet visible={visible} onClose={() => setVisible(false)} title="Agregar pesaje" scrollable={false}>
                <View style={styles.content}>
                    {loading ? <Text style={styles.helper}>Cargando...</Text> : null}
                    {error ? <Text style={styles.helper}>Error al conectar con la balanza</Text> : null}
                    {!loading && !error ? (
                        <>
                            <Text style={styles.weight}>{peso}</Text>
                            <Image source={BalanceImg} style={styles.image} resizeMode="contain" />
                            <Text style={styles.caption}>Datos obtenidos de la balanza eléctrica</Text>
                            <AppButton style={{ marginTop: 28, width: '100%' }} variant="secondary" onPress={save}>
                                Registrar manualmente
                            </AppButton>
                            <AppButton style={{ marginTop: 12, width: '100%' }} onPress={save}>
                                Guardar
                            </AppButton>
                        </>
                    ) : null}
                </View>
            </AppModalSheet>
        </>
    )
}

const styles = StyleSheet.create({
    content: {
        alignItems: "center",
        paddingBottom: 8,
    },
    helper: {
        color: "#6B7280",
        fontSize: 14,
    },
    weight: {
        color: "#111827",
        fontSize: 30,
        marginTop: 30,
        fontWeight: "800",
        textAlign: "center",
    },
    image: {
        width: 150,
        height: 90,
        marginTop: 12,
    },
    caption: {
        color: "#9CA3AF",
        marginTop: 10,
    },
});

export default AddPesajeSection;

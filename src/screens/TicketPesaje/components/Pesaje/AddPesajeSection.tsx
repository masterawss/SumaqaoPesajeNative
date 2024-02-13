import React, { useEffect } from "react";
import {Dimensions, Image, View, PermissionsAndroid} from "react-native";
import { Button, Modal, Portal, Text } from "react-native-paper";
import BalanceImg from '../../../../../assets/img/balance.png';
import RNBluetoothClassic from 'react-native-bluetooth-classic';

const deviceHeight = Dimensions.get('window').height


const AddPesajeSection = ({onSaved = (data: number) => {}}) => {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [visible, setVisible] = React.useState(false);
    const [peso, setPeso] = React.useState(0);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = {
        height: deviceHeight - (deviceHeight * 0.3),
        padding: 20,
        margin: 20,
        backgroundColor: 'white',
    };

    const save = () => {
        console.log('save')
        onSaved(1)
        hideModal()
    }

    useEffect(() => {
        connectToDevice()
    }, [])

    const connectToDevice = async () => {
        setLoading(true)
        await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Access fine location required for discovery',
              message:
                'In order to perform discovery, you must enable/allow ' +
                'fine location access.',
              buttonNeutral: 'Ask Me Later"',
              buttonNegative: 'Cancel',
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
            console.log('CON', con)
            // // const read = await device.read()
            // // console.log('READ', read)
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
            <Button style={{ position: 'absolute', bottom:0, right:0, margin: 10 }} mode="contained"
                onPress={showModal}
            >
                Agregar pesaje
            </Button>
            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                    <View style={{ alignItems: 'center' }}>
                        {
                            loading && <Text>Cargando...</Text>
                        }
                        {
                            error && <Text>Error al conectar con la balanza</Text>
                        }
                        {
                            !loading && !error && <>
                                <Text style={{ color: 'grey', fontSize: 30, marginTop: 50, fontWeight: 'bold', textAlign: 'center' }}>
                                    {peso}
                                </Text>
                                <Image source={BalanceImg} style={{ width: 150, height: 90, marginHorizontal: 'auto' }} resizeMode="contain" />
                                <Text style={{ color: '#d1d1d1' }}> Datos obtenidos de la balanza eléctrica</Text>
                                <Button style={{ marginTop: 50, width: '100%' }} mode="outlined" onPress={save}>
                                    Registrar manualmente
                                </Button>
                                <Button style={{ marginTop: 20,  width: '100%' }} mode="contained" onPress={save}>
                                    Guardar
                                </Button>
                            </>
                        }
                    </View>
                </Modal>
            </Portal>
        </>
    )
}

export default AddPesajeSection;
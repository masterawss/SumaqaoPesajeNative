import React from "react";
import {Dimensions, Image, View} from "react-native";
import { Button, Modal, Portal, Text } from "react-native-paper";
import BalanceImg from '../../../../../assets/img/balance.png';

const deviceHeight = Dimensions.get('window').height


const AddPesajeSection = ({onSaved = (data: number) => {}}) => {
    const [visible, setVisible] = React.useState(false);
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
                        <Text style={{ color: 'grey', fontSize: 30, marginTop: 50, fontWeight: 'bold', textAlign: 'center' }}> 98 Kg</Text>
                        <Image source={BalanceImg} style={{ width: 150, height: 90, marginHorizontal: 'auto' }} resizeMode="contain" />
                        <Text style={{ color: '#d1d1d1' }}> Datos obtenidos de la balanza eléctrica</Text>
                        <Button style={{ marginTop: 50, width: '100%' }} mode="outlined" onPress={save}>
                            Registrar manualmente
                        </Button>
                        <Button style={{ marginTop: 20,  width: '100%' }} mode="contained" onPress={save}>
                            Guardar
                        </Button>
                    </View>
                </Modal>
            </Portal>
        </>
    )
}

export default AddPesajeSection;
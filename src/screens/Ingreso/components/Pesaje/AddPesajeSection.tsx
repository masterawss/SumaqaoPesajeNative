import React from "react";
import {Dimensions} from "react-native";
import { Button, Modal, Portal, Text } from "react-native-paper";

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width

const AddPesajeSection = () => {
    const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = {
        height: deviceHeight - (deviceHeight * 0.5),
        padding: 20,
        margin: 20,
        backgroundColor: 'white',
    };

    return (
        <>
            <Button style={{ position: 'absolute', bottom:0, right:0, margin: 10 }} mode="contained"
                onPress={showModal}
            >
                Agregar pesaje
            </Button>
            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                    <Text> {deviceHeight} Example Modal.  Click outside this area to dismiss.</Text>
                </Modal>
            </Portal>
        </>
    )
}

export default AddPesajeSection;
import React, { useContext } from "react";
import { TouchableOpacity, View } from "react-native"
import { Button, Icon, MD3Colors, Modal, Portal, RadioButton, Text } from "react-native-paper";
import { TicketContext } from "../../Show/provider/TicketProvider";

const GuiaRemisionSelect = ({
    guia_remision_codigo,
    onSelect,
    guiasRemision
}:{
    guia_remision_codigo: string,
    onSelect: Function,
    guiasRemision: any[]
}) => {
    const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const {ticketPesaje, hasGuiasRemision} = useContext(TicketContext);
    const [guiaRemisionSelected, setGuiaRemisionSelected] = React.useState<any>(guia_remision_codigo);

    const guias = guiasRemision || ticketPesaje?.guias_remision ;

    const changeGuiaRemision = () => {
        // seleccionar guía de remisión en la lista ticketPesaje.guias_remision según su codigo que representa el valor de guiaRemisionSelected
        const guia_remision = guias.find((guia: any) => guia.codigo === guiaRemisionSelected);
        onSelect(guia_remision);
        hideModal();
    }


    return <>
        <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', paddingVertical: 3, paddingHorizontal:6, borderRadius: 10, backgroundColor: '#f7f7f7' }}
            onPress={showModal}
        >
            <Text>G.R.R: {guia_remision_codigo}</Text>
            <Icon source="chevron-down" size={20} color={MD3Colors.neutralVariant60} />
        </TouchableOpacity>

        <Portal>
            <Modal visible={visible} onDismiss={hideModal} 
                contentContainerStyle={{ backgroundColor: 'white', height: 'auto', bottom: 0, position: 'absolute', width: '100%', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
            >
                <View style={{ padding:10 }} >
                    <Text style={{ fontSize: 17, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 }}>Cambiar de guía de remisión</Text>
                    {
                        guias.length > 0 && guias.map((guia: any, index: number) => (
                            <TouchableOpacity onPress={() => setGuiaRemisionSelected(guia.codigo)} key={index} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                                <RadioButton
                                    value={guia.codigo}
                                    status={ guia.codigo === guiaRemisionSelected ? 'checked' : 'unchecked' }
                                />
                                <Text>{guia.codigo}</Text>
                            </TouchableOpacity>
                        ))
                    }
                    <Button style={{ marginTop: 20 }} mode="contained" onPress={changeGuiaRemision}>
                        Cambiar
                    </Button>
                </View>
            </Modal>
        </Portal>
    </>
}

export default GuiaRemisionSelect;
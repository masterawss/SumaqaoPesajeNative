import React , { useContext, useMemo, useState } from "react";
import { ActivityIndicator, RadioButton, Text } from "react-native-paper"
import { BalanzaBluetoothContext } from "../../../context/BalanzaBluetoothProvider";
import DesactivadoSection from "../../../../../components/Bluetooth/DesactivadoSection";
import NotFoundSection from "../../../../../components/Bluetooth/NotFoundSection";
import { Button, Icon, IconButton, TextInput } from "react-native-paper";
import { View } from "react-native";
import saveHook from "./ManualSection/saveHook";
import { TicketContext } from "../../../Show/provider/TicketProvider";
import Snackbar from "react-native-snackbar";
import GuiaRemisionSelect from "../GuiaRemisionSelect";

const BluetoothSection = ({ setVisible, ticketPesaje, loadTicket,
    guiasRemision,
    bluetoothEnabled,
    loading,
    device,
    peso,
    connectToDevice,
    checkBluetoothEnabled,
    isEdit,
    currentGuiaRemision, 
    hasGuiasRemision, 
    setCurrentGuiaRemision, 
    setNextGuiaRemision,
    peso_solo_paletas
}: any) => {
    const [loadingTara, setLoadingTara] = useState(false)
    const {save} = saveHook({setLoadingTara, setVisible, ticketPesaje, loadTicket})


    const [typeChange, setTypeChange] = useState('sumar')

    const onPress = async () => {
        try {
            await save({
                tara: isEdit ? taraFinalCalculated : peso,
                guia_remision_id: currentGuiaRemision?.id
            }, () => setVisible(false))
            setNextGuiaRemision()
        } catch (error) {
            Snackbar.show({
                text: 'No se pudo registrar la tara',
                duration: Snackbar.LENGTH_INDEFINITE,
                action: {
                    text: 'Cerrar',
                    textColor: 'red',
                    onPress: () => { /* Do something. */ },
                },
            });
        }
    }

    const taraFinalCalculated = useMemo(() => {
        if(typeChange === 'sumar') {
            return parseInt(peso) + parseInt(peso_solo_paletas)
        } else {
            return parseInt(peso) - parseInt(peso_solo_paletas)
        }
    }, [typeChange, peso, peso_solo_paletas])

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
            !!device && <>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <Icon source="bluetooth" size={30} />
                    <Text style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 20 }}>{peso} Kg</Text>
                </View>
            </View>
            {
                hasGuiasRemision 
                    && currentGuiaRemision 
                    && <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between',  alignItems: 'center', marginVertical: 20 }}>
                        <Text style={{ fontWeight: 'bold' }}>Se registrará para:</Text>
                        <GuiaRemisionSelect
                            guiasRemision={guiasRemision}
                            guia_remision_codigo={currentGuiaRemision.codigo}
                            onSelect={(guia:any) => {
                                setCurrentGuiaRemision(guia)
                            }}
                        />
                    </View>
            }
            {
                    isEdit && <>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Tara actual: {peso_solo_paletas} Kg</Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Tara final: {taraFinalCalculated} Kg</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5, marginTop: 25 }}>
                            <RadioButton
                                value="first"
                                status={ typeChange === 'sumar' ? 'checked' : 'unchecked' }
                                onPress={() => setTypeChange('sumar')}
                            />
                            <Text style={{ fontSize: 18 }}>Sumar</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5, marginBottom: 25 }}>
                            <RadioButton
                                value="first"
                                status={ typeChange === 'restar' ? 'checked' : 'unchecked' }
                                onPress={() => setTypeChange('restar')}
                            />
                            <Text style={{ fontSize: 18 }}>Restar</Text>
                        </View>
                    </>
                }
                <Button mode="contained" onPress={onPress} loading={loadingTara}>
                    Guardar
                </Button>
            </>
            
        }
    </>
}
export default BluetoothSection;
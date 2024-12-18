import React, { useContext, useEffect, useMemo } from "react";
import { ActivityIndicator, View } from "react-native"
import { Button, IconButton, Modal, Portal, RadioButton, Switch, Text, TextInput } from "react-native-paper"
import { TicketContext } from "../../Show/provider/TicketProvider";
import ManualSection from "./TaraSection/ManualSection";
import BluetoothSection from "./TaraSection/BluetoothSection";
import { BalanzaBluetoothContext } from "../../context/BalanzaBluetoothProvider";

const TaraSection = () => {
    const [visible, setVisible] = React.useState(false);
    const { loading, loadTicket, ticketPesaje, hasError, 
        currentGuiaRemision, 
        hasGuiasRemision, 
        setCurrentGuiaRemision, 
        setNextGuiaRemision
     } = useContext(TicketContext);
    const [isBluetooth, setIsBluetooth] = React.useState(false);
    const {bluetoothEnabled, loading: loadingBluetooh, device, peso, connectToDevice, checkBluetoothEnabled} = useContext(BalanzaBluetoothContext);

    const peso_solo_paletas = useMemo(() => {
        if(currentGuiaRemision){
            return currentGuiaRemision.ticket_pesaje_tara ?? 0
        }
        return ticketPesaje?.peso_solo_paletas
    }, [ticketPesaje?.peso_solo_paletas, currentGuiaRemision])

    const isEdit = useMemo(() => {
        return parseFloat(peso_solo_paletas) > 0
    }, [peso_solo_paletas])

    return (
        <>
            <View style={{
                padding: 10, borderRadius: 10, marginVertical: 4,
                display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                backgroundColor: "#fff",
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: 0.22,
                shadowRadius: 2.22,
                elevation: 3, 
            }}>
                {
                    loading && <Text style={{ marginVertical: 10, fontWeight: 'bold', color: 'grey' }}>
                        <ActivityIndicator size="small" color="grey" /> Cargando...
                    </Text>
                }
                {
                    hasError && <>
                        <Text style={{ marginVertical: 10, fontWeight: 'bold', color: 'grey' }}>Ha ocurrido un error</Text>
                            <IconButton
                            disabled={loading}
                            icon="sync"
                            iconColor='grey'
                            size={20}
                            onPress={loadTicket}
                        />
                    </>
                }
                {
                    !loading && !hasError && <>
                        {
                            !hasGuiasRemision ? <>
                                <Text style={{ marginVertical: 10, fontWeight: 'bold', color: 'grey' }}>Tara en paletas (Kg)</Text>

                                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                    <Text style={{ fontWeight: 'bold' }}>{peso_solo_paletas} Kg</Text>
                                    <IconButton
                                        disabled={loading}
                                        icon="pencil"
                                        iconColor='grey'
                                        size={20}
                                        onPress={() => setVisible(true)}
                                    />
                                </View>
                            </> : <>
                                    <Text style={{ marginVertical: 10, fontWeight: 'bold', color: 'grey' }}>Taras</Text>
                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                        <IconButton
                                            disabled={loading}
                                            icon="pencil"
                                            iconColor='grey'
                                            size={20}
                                            onPress={() => setVisible(true)}
                                        />
                                    </View>
                                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                </View>
                                <View style={{ flex: 1 }}>
                                    {
                                        ticketPesaje?.guias_remision?.map((guia: any, index: number) => (
                                            <View key={index} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}>
                                                <Text style={{ fontWeight: 'bold' }}>{guia.codigo}</Text>
                                                <Text>{guia.ticket_pesaje_tara} Kg</Text>
                                            </View>
                                        ))
                                    }
                                </View>
                            </>
                        }
                    </>
                }
            </View>

            <Portal>
                <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={{backgroundColor: 'white', padding: 20, marginHorizontal: 10}}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Tara en paletas</Text>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                            <Text style={{ color: 'grey', marginRight: 10 }}>{isBluetooth ? 'Bluetooth' : 'Manual'}</Text>
                            <Switch value={isBluetooth} onValueChange={() => setIsBluetooth(val => !val)} />
                        </View>
                    </View>
                    {
                        isBluetooth
                            ? <BluetoothSection
                                guiasRemision={ticketPesaje?.guias_remision}
                                peso_solo_paletas={peso_solo_paletas}
                                ticketPesaje={ticketPesaje}
                                loadTicket={loadTicket}
                                setVisible={setVisible}
                                bluetoothEnabled={bluetoothEnabled}
                                loading={loadingBluetooh}
                                device={device}
                                peso={peso}
                                connectToDevice={connectToDevice}
                                checkBluetoothEnabled={checkBluetoothEnabled}
                                isEdit={isEdit}
                                currentGuiaRemision={currentGuiaRemision}
                                hasGuiasRemision={hasGuiasRemision}
                                setCurrentGuiaRemision={setCurrentGuiaRemision}
                                setNextGuiaRemision={setNextGuiaRemision}
                            />
                            : <ManualSection isEdit={isEdit} setVisible={setVisible} ticketPesaje={ticketPesaje} loadTicket={loadTicket}
                                guiasRemision={ticketPesaje?.guias_remision}
                                peso_solo_paletas={peso_solo_paletas}
                                currentGuiaRemision={currentGuiaRemision}
                                hasGuiasRemision={hasGuiasRemision}
                                setCurrentGuiaRemision={setCurrentGuiaRemision}
                                setNextGuiaRemision={setNextGuiaRemision}
                            />
                    }
                </Modal>
            </Portal>
        </>
    )
}

export default TaraSection;
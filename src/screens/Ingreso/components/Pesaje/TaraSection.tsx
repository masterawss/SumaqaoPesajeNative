import React, { useContext, useEffect } from "react";
import { ActivityIndicator, View } from "react-native"
import { Button, IconButton, Modal, Portal, Text, TextInput } from "react-native-paper"
import api from "../../../../utils/axios";
import Snackbar from "react-native-snackbar";
import { TicketContext } from "../../Show/provider/TicketProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TaraSection = () => {
    const [visible, setVisible] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [taraValue, setTaraValue] = React.useState("0");
    const [taraKg, setTaraKg] = React.useState("0");
    const [loadingTara, setLoadingTara] = React.useState(false);

    const { loading, hasError, loadTicket, ticketPesaje, deleteTicket } = useContext(TicketContext);

    useEffect(() => {
        if(ticketPesaje?.peso_solo_paletas) {
            setTaraValue(ticketPesaje?.peso_solo_paletas)
            setTaraKg(ticketPesaje?.peso_solo_paletas)
        }
    }, [ticketPesaje])

    const save = async () => {
        setLoadingTara(true)
        const user = await AsyncStorage.getItem('user');
        api.post('/ticket_pesaje/update/'+ticketPesaje.id, { 
            peso_solo_paletas: taraKg,
            updated_user_id: JSON.parse(user || "")?.id
        })
        .then((response) => {
            console.log(response.data)
            setVisible(false)
            loadTicket()
        })
        .catch((error) => {
            console.log(error.response)
            Snackbar.show({
                text: 'No se pudo registrar la tara',
                duration: Snackbar.LENGTH_INDEFINITE,
                action: {
                  text: 'Cerrar',
                  textColor: 'red',
                  onPress: () => { /* Do something. */ },
                },
            });
        })
        .finally(() => {
            setLoadingTara(false)
        })
    }

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
                    error && <>
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
                    !loading && !error && <>
                        <Text style={{ marginVertical: 10, fontWeight: 'bold', color: 'grey' }}>Tara en paletas (Kg)</Text>

                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                            <Text style={{ fontWeight: 'bold' }}>{taraValue} Kg</Text>
                            <IconButton
                                disabled={loading}
                                icon="pencil"
                                iconColor='grey'
                                size={20}
                                onPress={() => setVisible(true)}
                            />
                        </View>
                    </>
                }
            </View>

            <Portal>
                <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={{backgroundColor: 'white', padding: 20}}>
                    <TextInput
                        mode="outlined"
                        label="Peso (Kg)"
                        keyboardType="numeric"
                        value={taraKg}
                        onChangeText={val => setTaraKg(val)}
                    />
                    <Button loading={loading} disabled={loading} style={{ marginTop: 10 }} mode="contained" onPress={save}>
                        Guardar
                    </Button>
                </Modal>
            </Portal>
        </>
    )
}

export default TaraSection;
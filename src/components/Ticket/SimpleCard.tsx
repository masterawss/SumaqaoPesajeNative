import { ActivityIndicator, Button, IconButton, Modal, Portal, RadioButton, Text, TextInput } from "react-native-paper";
import { Dimensions, ScrollView, View } from "react-native";
import { useContext, useEffect, useState } from "react";
import api from "../../utils/axios";
import { TicketContext } from "../../screens/Ingreso/Show/provider/TicketProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Snackbar from "react-native-snackbar";
import RNPickerSelect from 'react-native-picker-select';

const deviceHeight = Dimensions.get('window').height

const SimpleCard = ({id = null, ticket = null, canEdit = false}: any) => {
    const ticketContext = useContext(TicketContext);
    const [ticketData, setTicketData] = useState<any>(null);
    const [hasError, setHasError] = useState(false);
    const [loading, setLoading] = useState(false);



    const [visible, setVisible] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [nroSacos, setNroSacos] = useState("0");
    const [sacoColorId, setSacoColorId] = useState(0);
    const [sacosColor, setSacosColor] = useState<any[]>([]);

    useEffect(() => {
        if(canEdit){
            api.get('/sacos_color').then((response) => {
                // let sacos_color = response.data.sacos_color.map((item: any) => {
                //     item.label = item.descripcion;
                //     item.value = item.id;
                // })
                setSacosColor(response.data.sacos_color);
            }).catch((error) => {
                console.log(error.response);
                // setHasError(true);
            }).finally(() => {
                // setLoading(false);
            });
        }
    }, [])

    const containerStyle = {
        height: deviceHeight - (deviceHeight * 0.3),
        padding: 20,
        margin: 20,
        backgroundColor: 'white',
    };

    useEffect(() => {
        if(id){
            api.get('/ticket_pesaje/'+id).then((response) => {
                console.log(response.data);
                setTicketData(response.data.ticket_pesaje);
            }).catch((error) => {
                console.log(error.response);
                // setHasError(true);
            }).finally(() => {
                // setLoading(false);
            });
        }else if(ticket){
            setTicketData(ticket)
        }else{
            setTicketData(ticketContext.ticketPesaje)
        }
    }, [])

    const save = async () => {

        if(nroSacos <= 0 || !sacoColorId){
            Snackbar.show({
                text: 'Ingrese los datos correctamente',
                duration: Snackbar.LENGTH_INDEFINITE,
                action: {
                  text: 'Cerrar',
                  textColor: 'red',
                  onPress: () => { /* Do something. */ },
                },
            });
            return;
        }

        setSaveLoading(true);
        const user = await AsyncStorage.getItem('user');
        api.post('/ticket_pesaje/update/'+ticketData.id, { 
            nro_sacos: nroSacos,
            saco_color_id: sacoColorId,
            updated_user_id: JSON.parse(user || "")?.id
        })
        .then((response) => {
            console.log(response.data)
            setVisible(false)
            ticketContext.loadTicket()
        })
        .catch((error) => {
            console.log(error.response)
            Snackbar.show({
                text: 'No se pudo registrar los sacos',
                duration: Snackbar.LENGTH_INDEFINITE,
                action: {
                  text: 'Cerrar',
                  textColor: 'red',
                  onPress: () => { /* Do something. */ },
                },
            });
        })
        .finally(() => {
            setSaveLoading(false)
        })
    }

    return <View style={{ paddingHorizontal: 20, paddingVertical: 30, backgroundColor: '#f5f5f5', borderRadius: 10 }}>
            {
                loading && !hasError && <Text style={{ textAlign: 'center', color: 'grey', fontWeight: 'bold', marginTop: 20 }}>
                    <ActivityIndicator size="small" />
                </Text>
            }
            {
                ticketContext.loading && !ticketContext.hasError &&
                <View>
                    <Text style={{ textAlign: 'center', }}>
                        <ActivityIndicator size="small" />
                    </Text>
                </View>
            }
            {
                !ticketContext.loading && !ticketContext.hasError && ticketData && <>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <Text variant="titleMedium">{ticketData.codigo}</Text>
                            <View style={{ borderRadius: 40, backgroundColor: ticketData.is_saved ? 'teal' : 'orange', paddingHorizontal: 8, marginLeft: 8 }}>
                                <Text style={{ color: 'white', fontSize: 12 }}>{ticketData.is_saved ? 'Finalizado' : 'Pendiente'}</Text>
                            </View>
                        </View>
                        <View >
                            <Text style={{ color: 'silver', fontSize: 12 }}>{ticketData.fecha_desc}</Text>
                        </View>
                    </View>
                    <View style={{ display: 'flex', marginTop: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ color: 'grey', fontSize: 14 }}>
                            • {ticketData.guias_remision.length} guías rem.
                        </Text>
                        <Text style={{ color: 'grey', fontSize: 14 }}>
                            • {ticketData.nro_sacos} kg bruto
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: 'grey', fontSize: 14 }}>
                                • {ticketData.nro_sacos} sacos recib. ({ticketData.saco_color?.descripcion})
                            </Text>
                            {
                                canEdit && <IconButton icon="pencil" onPress={() => setVisible(true)} />
                            }
                        </View>
                    </View>
                </>
            }
            {
                canEdit && <Portal>
                    <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={containerStyle}>
                        <ScrollView>
                            <View style={{ marginBottom: 20 }}>
                                {
                                    sacosColor.map((item) => <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <RadioButton
                                            key={item.id}
                                            value={item.descripcion}
                                            status={ sacoColorId === item.id ? 'checked' : 'unchecked' }
                                            onPress={() => setSacoColorId(item.id)}
                                        />
                                        <Text>{item.descripcion}</Text>
                                    </View>)
                                }
                            </View>
                            <TextInput
                                mode="outlined"
                                label="Cantidad de sacos"
                                keyboardType="numeric"
                                value={nroSacos}
                                onChangeText={val => setNroSacos(val)}
                            />
                            <Button style={{ marginTop: 10 }} mode="contained" loading={saveLoading} disabled={saveLoading} onPress={save}>
                                Guardar
                            </Button>
                        </ScrollView>
                    </Modal>
                </Portal>
            }
        </View>
}
export default SimpleCard;
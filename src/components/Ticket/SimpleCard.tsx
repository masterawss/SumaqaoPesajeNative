import { ActivityIndicator, Button, Icon, IconButton, MD3Colors, Modal, Portal, RadioButton, Text, TextInput } from "react-native-paper";
import { Dimensions, Image, ScrollView, View } from "react-native";
import { useContext, useEffect, useState } from "react";
import api from "../../utils/axios";
import { TicketContext } from "../../screens/TicketPesaje/Show/provider/TicketProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Snackbar from "react-native-snackbar";
import RNPickerSelect from 'react-native-picker-select';
import { numberFormat } from "../../utils/numberFormat";

const deviceHeight = Dimensions.get('window').height

const SimpleCard = ({id = null, ticket = null, canEdit = false}: any) => {
    const ticketContext = useContext(TicketContext);
    const [ticketData, setTicketData] = useState<any>(null);
    const [hasError, setHasError] = useState(false);
    const [loading, setLoading] = useState(false);

    const [visible, setVisible] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [nroSacos, setNroSacos] = useState<string|null>(null);
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

    useEffect(() => {
        if(ticketContext.ticketPesaje){
            if(ticketContext.ticketPesaje.nro_sacos > 0){
                setNroSacos(ticketContext.ticketPesaje.nro_sacos.toString())
                setSacoColorId(ticketContext.ticketPesaje.saco_color_id)
            }else{
                setNroSacos(null)
            }
        }
    }, [ticketContext.ticketPesaje])

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
    }, [ticketContext.ticketPesaje])

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

    return <View style={{  paddingVertical: 10, backgroundColor: 'white', borderRadius: 10 }}>
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
                    <View style={{ display: 'flex', width: '100%', flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center' }}>
                        <Image source={{ uri: ticketData.main_image_url }}
                            style={{ height: 100, width: '30%', backgroundColor: 'grey', borderRadius: 10 }}
                        />
                        <View style={{ width: '70%', paddingLeft: 10 }}>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{ fontWeight: 'bold' }}>{ticketData.codigo}</Text>
                                <Text style={{ color: 'grey' }}>{ticketData.fecha_desc}</Text>
                            </View>
                            <View style={{ marginVertical: 8 }}>
                                <Text>{ticketData.guias_remision.length} G.R.R.  •   {numberFormat( ticketData.is_exportacion ? ticketData.total_grr_sacos : ticketData.total_nro_sacos)} sacos</Text>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{ color: 'grey' }}>{ticketData.placa_tracto}</Text>
                                <View style={{ borderRadius: 40, backgroundColor: ticketData.is_saved ? 'teal' : 'orange', paddingHorizontal: 10, paddingVertical: 4 }}>
                                    <Text style={{ color: 'white', fontSize: 12 }}>{ticketData.is_saved ? 'Guardado' : 'Sin guardar'}</Text>
                                </View>
                            </View>
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
                                    sacosColor.map((item) => <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <RadioButton
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
                                placeholder={!nroSacos ? '0' : ''}
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
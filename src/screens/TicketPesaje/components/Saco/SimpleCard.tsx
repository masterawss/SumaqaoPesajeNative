import React, { useContext, useEffect } from "react";
import { ActivityIndicator, Alert, Dimensions, ScrollView, View } from "react-native"
import { Button, IconButton, MD3Colors, Modal, Portal, RadioButton, Text, TextInput } from "react-native-paper"
import { TicketContext } from "../../Show/provider/TicketProvider";
import api from "../../../../utils/axios";
import Snackbar from "react-native-snackbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
const deviceHeight = Dimensions.get('window').height

const SimpleCard = ({col = 1, nroItem}: any) => {
    const { ticketPesaje, loadTicket } = useContext(TicketContext);

    const [sacosColor, setSacosColor] = React.useState([]);
    const [saveLoading, setSaveLoading] = React.useState(false);


    const [nroSacos, setNroSacos] = React.useState(0);
    const [sacoColorId, setSacoColorId] = React.useState(0);
    const [sacoColor, setSacoColor] = React.useState({});
    const [visible, setVisible] = React.useState(false);

    useEffect(() => {
        if(col === 1) {
            setNroSacos(ticketPesaje.nro_sacos);
            setSacoColorId(ticketPesaje.saco_color_id);
            setSacoColor(ticketPesaje.saco_color);
        }else{
            setNroSacos(ticketPesaje.nro_sacos2);
            setSacoColorId(ticketPesaje.saco_color2_id);
            setSacoColor(ticketPesaje.saco_color2);
        }
    }, [ticketPesaje]);

    useEffect(() => {
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
    }, [])

    const containerStyle = {
        height: deviceHeight - (deviceHeight * 0.3),
        padding: 20,
        margin: 20,
        backgroundColor: 'white',
    };


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
        const data = col === 1 ? 
            {
                nro_sacos: nroSacos, 
                saco_color_id: sacoColorId, 
                updated_user_id: JSON.parse(user || "")?.id 
            } :
            {
                nro_sacos2: nroSacos, 
                saco_color2_id: sacoColorId, 
                updated_user_id: JSON.parse(user || "")?.id 
            }
        api.post('/ticket_pesaje/update/'+ticketPesaje.id, data)
        .then((response) => {
            console.log(response.data)
            setVisible(false)
            loadTicket()
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



    return (
        <View style={{
            borderRadius: 10, marginVertical: 4,
            display: 'flex', flexDirection: 'row',
            backgroundColor: "#f5f5f5",
        }}>
            <View style={{ backgroundColor: '#7da82c', padding: 15, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>
                <Text style={{ color: 'white', fontSize: 15 }}>{nroItem}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '85%' }}>
                <View>
                    <Text style={{ fontWeight: 'bold', marginLeft: 20, fontSize: 16 }}>
                        { sacoColor?.descripcion ? 'Saco: '+sacoColor?.descripcion : 'Saco: (Opcional)' }
                    </Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{nroSacos}</Text>
                    <IconButton icon="pencil" color={MD3Colors.orange} size={20} onPress={() => setVisible(true)} />
                </View>
            </View>

            <Portal>
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
        </View>
    )
}

export default SimpleCard;
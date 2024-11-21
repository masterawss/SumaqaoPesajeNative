import { Alert, TouchableOpacity, View } from 'react-native';
import { Divider, IconButton, Text, Button, Portal, Modal, TextInput } from 'react-native-paper';
import api from '../../../utils/axios';
import { useContext, useEffect, useState } from 'react';
import Snackbar from 'react-native-snackbar';
import { TicketContext } from '../../TicketPesaje/Show/provider/TicketProvider';
import { numberFormat } from '../../../utils/numberFormat';

const SimpleCard = ({guiaRemision: gr, ticketId, isInTicket = false}: any) => {
    const ticketContext = useContext(TicketContext);

    const [loading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [added, setAdded] = useState(false);
    const [guiaRemision, setGuiaRemision] = useState(gr);
    useEffect(() => {
        if(guiaRemision.ticket_pesaje_id === ticketId){
            setAdded(true);
        }else{
            setAdded(false);
        }
    }, []);


    const deleteGuiaRemision = () => {
        Alert.alert('Quitar guia de ingreso', '¿Está seguro que desea quitar la guía de ingreso?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                onPress: () => {
                    deleteGuiaRemisionConfirmed();
                }
            }
        ]);
    }

    const deleteGuiaRemisionConfirmed = () => {
        setLoading(true);
        setHasError(false);
        api.delete('/pesaje_guia_remision/'+guiaRemision.id).then((response) => {
            console.log(response.data);
            if(isInTicket){
                ticketContext.loadTicket();
            }else{
                setAdded(false);
            }
        }).catch((error) => {
            console.log(error.response);
            Snackbar.show({
                text: 'No se pudo quitar la guía',
                duration: Snackbar.LENGTH_INDEFINITE,
                action: {
                  text: 'Cerrar',
                  textColor: 'red',
                  onPress: () => { /* Do something. */ },
                },
              });
        }).finally(() => {
            setLoading(false);
            setHasError(true);
        });
    }

    const addGuiaRemision = () => {
        setLoading(true);
        setHasError(false);
        api.post('/pesaje_guia_remision/store', {
            ticket_pesaje_id: ticketId,
            guia_remision_id: guiaRemision.id
        }).then((response) => {
            console.log("RECIBIDO", response.data);
            setAdded(true);
            Snackbar.show({
                text: 'Se agregó correctamente',
                duration: Snackbar.LENGTH_SHORT,
                action: {
                  text: 'Cerrar',
                  textColor: 'green',
                  onPress: () => { /* Do something. */ },
                },
              });
        }).catch((error) => {
            console.log(error.response);
            if(error.response){
                Snackbar.show({
                    text: error.response.data.message,
                    duration: Snackbar.LENGTH_INDEFINITE,
                    action: {
                      text: 'Cerrar',
                      textColor: 'red',
                      onPress: () => { /* Do something. */ },
                    },
                  });
            }
        }).finally(() => {
            setLoading(false);
        });
    }

    const [visible, setVisible] = useState(false);
    const [nroSacos, setNroSacos] = useState(guiaRemision.nro_sacos);
    const [nroSacos2, setNroSacos2] = useState(guiaRemision.nro_sacos2);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const updateGuiaRemision = () => {
        hideModal();
        api.put('/guia_remision/update/'+guiaRemision.id, {
            nro_sacos: nroSacos,
            nro_sacos2: nroSacos2,
        }).then((response) => {
            console.log("RECIBIDO", response.data);
            // setAdded(true);
            setGuiaRemision({
                ...guiaRemision,
                nro_sacos: nroSacos,
                nro_sacos2: nroSacos2
            })
            Snackbar.show({
                text: 'Se editó correctamente',
                duration: Snackbar.LENGTH_SHORT,
                action: {
                  text: 'Cerrar',
                  textColor: 'green',
                  onPress: () => { /* Do something. */ },
                },
              });
        }).catch((error) => {
            console.log(error.response);
            if(error.response){
                Snackbar.show({
                    text: error.response.data.message,
                    duration: Snackbar.LENGTH_INDEFINITE,
                    action: {
                      text: 'Cerrar',
                      textColor: 'red',
                      onPress: () => { /* Do something. */ },
                    },
                  });
            }
        }).finally(() => {
            setLoading(false);
        });
    }

    const style= {
        textTitle: {
            fontWeight: 'bold',
            fontSize: 15,
            color: 'grey'
        },
    }

    return (
        <View style={{
            borderRadius: 10,
            marginBottom: 10,
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
        <View style={{ display: 'flex', paddingHorizontal: 10, paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                    <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{guiaRemision.codigo}</Text>
                    <View style={{ borderRadius: 10, paddingVertical: 4, paddingHorizontal: 10, 
                        backgroundColor: guiaRemision.is_exportacion ? '#5dd9ab' : '#dbab7d' }}
                    >
                        <Text style={{ color: 'white', fontSize: 12, textAlign: 'center' }}>
                            {guiaRemision.is_exportacion ? 'Exportación' : 'Ingreso'}
                        </Text>
                    </View>
                </View>
                {
                    added
                    ? <Button
                        style={{ marginTop: -5 }}
                        disabled={loading}
                        icon={'delete'}
                        textColor='grey'
                        size={20}
                        onPress={deleteGuiaRemision}
                    >
                        Quitar
                    </Button>
                    : <Button
                        style={{ marginTop: -5 }}
                        disabled={loading}
                        icon="plus"
                        iconColor='grey'
                        size={20}
                        onPress={addGuiaRemision}
                    >
                        Agregar
                    </Button>
                }
        </View>
        <Divider style={{ marginTop: 10, backgroundColor: 'grey' }} />
        <View style={{ padding: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                    <Text style={style.textTitle}>Fecha emisión</Text>
                    <Text>{guiaRemision.fecha_desc}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={style.textTitle}>Placas</Text>
                    <Text>{guiaRemision.placa}</Text>
                </View>
            </View>
            <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                {
                    !guiaRemision.is_exportacion &&
                    <View style={{ flex: 1 }}>
                        <Text style={style.textTitle}>Sacos en guía</Text>
                        <Text>{numberFormat(guiaRemision.total_sacos)}</Text>
                    </View>
                }
                <View style={{ flex: 1 }}>
                    <Text style={style.textTitle}>Peso neto</Text>
                    <Text>{numberFormat(guiaRemision.peso_neto_enviado)}</Text>
                </View>
            </View>
            {
                guiaRemision.sku && <Text style={{ marginTop: 10, }}>{guiaRemision.sku}</Text>
            }
        </View>
        {
            guiaRemision.is_exportacion && <>
                <Divider style={{  backgroundColor: 'grey' }} />
                <View style={{ padding: 10 }}>
                    <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={style.textTitle}>Nro de sacos</Text>
                            <Text>{numberFormat(guiaRemision.nro_sacos)}</Text>
                        </View>
                        {/* <View style={{ flex: 1 }}>
                            <Text style={style.textTitle}>Nro de sacos 2</Text>
                            <Text>{numberFormat(guiaRemision.nro_sacos2)}</Text>
                        </View> */}
                    </View>
                    <Button mode='contained' style={{ marginTop: 10 }} onPress={() => showModal()}>
                        Actualizar
                    </Button>
                </View>
            </>
        }
        <Portal>
            <Modal visible={visible} onDismiss={hideModal} 
                contentContainerStyle={{ backgroundColor: 'white', height: 'auto', bottom: 0, position: 'absolute', width: '100%', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
            >
                <View style={{ padding:10 }} >
                    <Text style={{ fontSize: 17, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 }}>Editar nro de sacos para ticket de pesaje</Text>
                    <TextInput label="Nro de sacos" value={nroSacos} onChangeText={setNroSacos} keyboardType='numeric' />
                    {/* <TextInput label="Nro de sacos 2" value={nroSacos2} onChangeText={setNroSacos2} keyboardType='numeric' /> */}
                    <Button style={{ marginTop: 20 }} mode="contained" onPress={updateGuiaRemision}>
                        Cambiar
                    </Button>
                </View>
            </Modal>
        </Portal>
    </View>)
}
export default SimpleCard;
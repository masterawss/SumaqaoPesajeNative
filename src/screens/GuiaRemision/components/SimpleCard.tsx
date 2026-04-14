import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useContext, useEffect, useState } from 'react';

import api from '../../../utils/axios';
import { TicketContext } from '../../TicketPesaje/Show/provider/TicketProvider';
import { numberFormat } from '../../../utils/numberFormat';
import AppButton from '../../../components/ui/AppButton';
import AppDivider from '../../../components/ui/AppDivider';
import AppInput from '../../../components/ui/AppInput';
import AppModalSheet from '../../../components/ui/AppModalSheet';
import AppSurface from '../../../components/ui/AppSurface';
const Snackbar = require("react-native-snackbar");

const SimpleCard = ({guiaRemision: gr, ticketId, isInTicket = false}: any) => {
    const ticketContext = useContext(TicketContext) as any;

    const [loading, setLoading] = useState(false);
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
                  onPress: () => {},
                },
              });
        }).finally(() => {
            setLoading(false);
        });
    }

    const addGuiaRemision = () => {
        setLoading(true);
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
                  onPress: () => {},
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
                      onPress: () => {},
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

    const updateGuiaRemision = () => {
        setVisible(false);
        api.put('/guia_remision/update/'+guiaRemision.id, {
            nro_sacos: nroSacos,
            nro_sacos2: nroSacos2,
        }).then((response) => {
            console.log("RECIBIDO", response.data);
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
                  onPress: () => {},
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
                      onPress: () => {},
                    },
                  });
            }
        }).finally(() => {
            setLoading(false);
        });
    }

    return (
        <AppSurface style={styles.card}>
            <View style={styles.header}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.code}>{guiaRemision.codigo}</Text>
                    <View style={[styles.typeChip, guiaRemision.is_exportacion ? styles.typeExport : styles.typeIngreso]}>
                        <Text style={styles.typeChipText}>
                            {guiaRemision.is_exportacion ? 'Exportación' : 'Ingreso'}
                        </Text>
                    </View>
                </View>
                {added ? (
                    <AppButton
                        compact
                        variant="secondary"
                        icon="delete-outline"
                        disabled={loading}
                        onPress={deleteGuiaRemision}
                    >
                        Quitar
                    </AppButton>
                ) : (
                    <AppButton
                        compact
                        variant="secondary"
                        icon="plus"
                        disabled={loading}
                        onPress={addGuiaRemision}
                    >
                        Agregar
                    </AppButton>
                )}
            </View>
            <AppDivider style={{ marginTop: 12, marginBottom: 12 }} />
            <View style={styles.grid}>
                <View style={styles.col}>
                    <Text style={styles.label}>Fecha emisión</Text>
                    <Text style={styles.value}>{guiaRemision.fecha_desc}</Text>
                </View>
                <View style={styles.col}>
                    <Text style={styles.label}>Placas</Text>
                    <Text style={styles.value}>{guiaRemision.placa}</Text>
                </View>
            </View>
            <View style={[styles.grid, { marginTop: 12 }]}>
                {!guiaRemision.is_exportacion ? (
                    <View style={styles.col}>
                        <Text style={styles.label}>Sacos en guía</Text>
                        <Text style={styles.value}>{numberFormat(guiaRemision.total_sacos)}</Text>
                    </View>
                ) : null}
                <View style={styles.col}>
                    <Text style={styles.label}>Peso neto</Text>
                    <Text style={styles.value}>{numberFormat(guiaRemision.peso_neto_enviado)}</Text>
                </View>
            </View>
            {guiaRemision.sku ? <Text style={styles.sku}>{guiaRemision.sku}</Text> : null}
            {guiaRemision.is_exportacion ? (
                <>
                    <AppDivider style={{ marginVertical: 12 }} />
                    <View style={styles.grid}>
                        <View style={styles.col}>
                            <Text style={styles.label}>Nro de sacos</Text>
                            <Text style={styles.value}>{numberFormat(guiaRemision.nro_sacos)}</Text>
                        </View>
                        <View style={styles.editCol}>
                            <AppButton compact onPress={() => setVisible(true)}>
                                Actualizar
                            </AppButton>
                        </View>
                    </View>
                </>
            ) : null}
            <AppModalSheet
                visible={visible}
                onClose={() => setVisible(false)}
                title="Editar nro de sacos"
                subtitle="Actualiza el número de sacos asociado a esta guía."
            >
                <View style={styles.sheetContent}>
                    <AppInput label="Nro de sacos" value={String(nroSacos ?? "")} onChangeText={setNroSacos} keyboardType='numeric' />
                    <AppButton style={{ marginTop: 12 }} onPress={updateGuiaRemision}>
                        Cambiar
                    </AppButton>
                </View>
            </AppModalSheet>
        </AppSurface>
    )
}

const styles = StyleSheet.create({
    card: {
        padding: 12,
        marginBottom: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
    },
    code: {
        color: '#111827',
        fontSize: 15,
        fontWeight: '800',
    },
    typeChip: {
        alignSelf: 'flex-start',
        marginTop: 6,
        borderRadius: 999,
        paddingVertical: 4,
        paddingHorizontal: 9,
    },
    typeExport: {
        backgroundColor: '#D1FAE5',
    },
    typeIngreso: {
        backgroundColor: '#FDE68A',
    },
    typeChipText: {
        color: '#111827',
        fontSize: 11,
        fontWeight: '800',
    },
    grid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    col: {
        flex: 1,
    },
    editCol: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    label: {
        color: '#6B7280',
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    value: {
        color: '#111827',
        fontSize: 13,
        marginTop: 2,
    },
    sku: {
        color: '#374151',
        fontSize: 12,
        marginTop: 8,
    },
    sheetContent: {
        paddingBottom: 8,
    },
});

export default SimpleCard;

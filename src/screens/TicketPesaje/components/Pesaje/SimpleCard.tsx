import React, { useContext } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { TicketContext } from "../../Show/provider/TicketProvider";
import api from "../../../../utils/axios";
import GuiaRemisionSelect from "./GuiaRemisionSelect";
import AppIconButton from "../../../../components/ui/AppIconButton";
import { Snackbar } from "../../../../utils/snackbar";

const SimpleCard = ({detalle, nro}: any) => {
    const { loadTicket } = useContext(TicketContext) as any;
    const [loadingDelete, setLoadingDelete] = React.useState(false);

    const deleteData = () => {
        Alert.alert('Eliminar ticket', '¿Está seguro que desea eliminar el ticket?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                onPress: () => {
                    deleteDataConfirmed();
                }
            }
        ]);
    }

    const deleteDataConfirmed = async () => {
        setLoadingDelete(true);
        const user = await AsyncStorage.getItem('user');
        api.delete('/ticket_pesaje_detalle/'+detalle.id, {
            params: {
                deleted_user_id: JSON.parse(user || "")?.id
            }
        }).then((response) => {
            console.log(response.data);
            loadTicket();
        }).catch((error) => {
            console.log('ERROR', error.response.data);
            Snackbar.show({
                text: 'No se pudo crear el registro',
                duration: Snackbar.LENGTH_INDEFINITE,
                action: {
                  text: 'Cerrar',
                  textColor: 'red',
                  onPress: () => {},
                },
              });
        }).finally(() => {
            setLoadingDelete(false);
        });
    }

    const changeGuiaRemision = async (guia_remision: any) => {
        api.put('/ticket_pesaje_detalle/update/'+detalle.id, {
            guia_remision_id: guia_remision.id
        }).then((response) => {
            console.log(response.data);
            loadTicket();
        }).catch((error) => {
            console.log('ERROR', error.response.data);
            Snackbar.show({
                text: 'No se pudo crear el registro',
                duration: Snackbar.LENGTH_INDEFINITE,
                action: {
                  text: 'Cerrar',
                  textColor: 'red',
                  onPress: () => {},
                },
            });
        });
    }

    return (
        <View style={styles.card}>
            <View style={styles.indexBadge}>
                <Text style={styles.indexText}>{nro}</Text>
            </View>
            <View style={styles.body}>
                <View style={styles.mainContent}>
                    <Text style={styles.weight}>{detalle.peso_bruto} kg</Text>
                    <GuiaRemisionSelect
                        compact
                        guia_remision_codigo={detalle.g_r_cod}
                        onSelect={(guia: any) => {
                            changeGuiaRemision(guia);
                        }}
                    />
                </View>
                {loadingDelete ? (
                    <ActivityIndicator size="small" color="#6B7280" />
                ) : (
                    <AppIconButton
                        icon="delete-outline"
                        color="#6B7280"
                        size={20}
                        onPress={deleteData}
                    />
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        paddingVertical: 8,
        paddingLeft: 8,
        paddingRight: 6,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    indexBadge: {
        width: 28,
        height: 28,
        borderRadius: 999,
        backgroundColor: "#111827",
        alignItems: "center",
        justifyContent: "center",
    },
    indexText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "800",
    },
    body: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        minWidth: 0,
    },
    mainContent: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        minWidth: 0,
    },
    weight: {
        color: "#111827",
        fontSize: 15,
        fontWeight: "800",
        flexShrink: 0,
    },
});

export default SimpleCard;

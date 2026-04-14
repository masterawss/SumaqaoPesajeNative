import React, { useContext } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { TicketContext } from "../../Show/provider/TicketProvider";
import api from "../../../../utils/axios";
import GuiaRemisionSelect from "./GuiaRemisionSelect";
import AppIconButton from "../../../../components/ui/AppIconButton";
import AppSurface from "../../../../components/ui/AppSurface";
const Snackbar = require("react-native-snackbar");

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
        <AppSurface style={styles.card}>
            <View style={styles.indexBadge}>
                <Text style={styles.indexText}>{nro}</Text>
            </View>
            <View style={styles.body}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.weight}>{detalle.peso_bruto} kg</Text>
                    <GuiaRemisionSelect
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
        </AppSurface>
    )
}

const styles = StyleSheet.create({
    card: {
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    indexBadge: {
        width: 34,
        height: 34,
        borderRadius: 999,
        backgroundColor: "#111827",
        alignItems: "center",
        justifyContent: "center",
    },
    indexText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "800",
    },
    body: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    weight: {
        color: "#111827",
        fontSize: 16,
        fontWeight: "800",
        marginBottom: 6,
    },
});

export default SimpleCard;

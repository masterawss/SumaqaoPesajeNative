import React, { useContext, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { TicketContext } from "../../Show/provider/TicketProvider";
import api from "../../../../utils/axios";
import AppButton from "../../../../components/ui/AppButton";
import AppIconButton from "../../../../components/ui/AppIconButton";
import AppInput from "../../../../components/ui/AppInput";
import AppModalSheet from "../../../../components/ui/AppModalSheet";
import AppRadio from "../../../../components/ui/AppRadio";
import AppSurface from "../../../../components/ui/AppSurface";
import { Snackbar } from "../../../../utils/snackbar";

const SimpleCard = ({col = 1, nroItem}: any) => {
    const { ticketPesaje, loadTicket } = useContext(TicketContext) as any;

    const [sacosColor, setSacosColor] = React.useState<any[]>([]);
    const [saveLoading, setSaveLoading] = React.useState(false);
    const [nroSacos, setNroSacos] = React.useState<any>(0);
    const [sacoColorId, setSacoColorId] = React.useState(0);
    const [sacoColor, setSacoColor] = React.useState<any>({});
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
            setSacosColor(response.data.sacos_color);
        }).catch((error) => {
            console.log(error.response);
        });
    }, [])

    const save = async () => {
        if(nroSacos <= 0 || !sacoColorId){
            Snackbar.show({
                text: 'Ingrese los datos correctamente',
                duration: Snackbar.LENGTH_INDEFINITE,
                action: {
                  text: 'Cerrar',
                  textColor: 'red',
                  onPress: () => {},
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
                  onPress: () => {},
                },
            });
        })
        .finally(() => {
            setSaveLoading(false)
        })
    }

    return (
        <AppSurface style={styles.card}>
            <View style={styles.indexBadge}>
                <Text style={styles.indexText}>{nroItem}</Text>
            </View>
            <View style={styles.body}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{ sacoColor?.descripcion ? 'Saco: '+sacoColor?.descripcion : 'Saco: (Opcional)' }</Text>
                    <Text style={styles.value}>{nroSacos}</Text>
                </View>
                <AppIconButton icon="pencil" color="#111827" variant="soft" size={20} onPress={() => setVisible(true)} />
            </View>

            <AppModalSheet
                visible={visible}
                onClose={() => setVisible(false)}
                title={`Editar sacos ${nroItem}`}
                subtitle="Selecciona el tipo de saco y la cantidad."
            >
                <View style={styles.sheetContent}>
                    <View style={styles.radioList}>
                        {sacosColor.map((item) => (
                            <AppRadio
                                key={item.id}
                                label={item.descripcion}
                                checked={sacoColorId === item.id}
                                onPress={() => setSacoColorId(item.id)}
                            />
                        ))}
                    </View>
                    <AppInput
                        label="Cantidad de sacos"
                        keyboardType="numeric"
                        value={String(nroSacos ?? "")}
                        onChangeText={val => setNroSacos(val)}
                        placeholder={!nroSacos ? '0' : ''}
                    />
                    <AppButton style={{ marginTop: 12 }} loading={saveLoading} disabled={saveLoading} onPress={save}>
                        Guardar
                    </AppButton>
                </View>
            </AppModalSheet>
        </AppSurface>
    )
}

const styles = StyleSheet.create({
    card: {
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    indexBadge: {
        width: 30,
        height: 30,
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
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
    },
    title: {
        color: "#111827",
        fontSize: 14,
        fontWeight: "700",
    },
    value: {
        color: "#6B7280",
        fontSize: 13,
        marginTop: 2,
    },
    sheetContent: {
        paddingBottom: 8,
    },
    radioList: {
        marginBottom: 12,
    },
});

export default SimpleCard;

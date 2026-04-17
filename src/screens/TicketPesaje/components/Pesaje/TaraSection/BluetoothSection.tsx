import React , { useContext, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { BalanzaBluetoothContext } from "../../../context/BalanzaBluetoothProvider";
import DesactivadoSection from "../../../../../components/Bluetooth/DesactivadoSection";
import NotFoundSection from "../../../../../components/Bluetooth/NotFoundSection";
import saveHook from "./ManualSection/saveHook";
import GuiaRemisionSelect from "../GuiaRemisionSelect";
import AppRadio from "../../../../../components/ui/AppRadio";
import AppButton from "../../../../../components/ui/AppButton";
import AppSurface from "../../../../../components/ui/AppSurface";
import { Snackbar } from "../../../../../utils/snackbar";

const BluetoothSection = ({ setVisible, ticketPesaje, loadTicket,
    guiasRemision,
    bluetoothEnabled,
    loading,
    device,
    peso,
    connectToDevice,
    checkBluetoothEnabled,
    isEdit,
    currentGuiaRemision,
    hasGuiasRemision,
    setCurrentGuiaRemision,
    setNextGuiaRemision,
    peso_solo_paletas
}: any) => {
    const [loadingTara, setLoadingTara] = useState(false)
    const { activeBalanza } = useContext(BalanzaBluetoothContext);
    const {save} = saveHook({setLoadingTara, setVisible, ticketPesaje, loadTicket})

    const [typeChange, setTypeChange] = useState('sumar')

    const onPress = async () => {
        try {
            await save({
                tara: isEdit ? taraFinalCalculated : peso,
                guia_remision_id: currentGuiaRemision?.id
            }, () => setVisible(false))
            setNextGuiaRemision()
        } catch (error) {
            Snackbar.show({
                text: 'No se pudo registrar la tara',
                duration: Snackbar.LENGTH_INDEFINITE,
                action: {
                    text: 'Cerrar',
                    textColor: 'red',
                    onPress: () => {},
                },
            });
        }
    }

    const taraFinalCalculated = useMemo(() => {
        if(typeChange === 'sumar') {
            return parseInt(peso, 10) + parseInt(peso_solo_paletas, 10)
        } else {
            return parseInt(peso, 10) - parseInt(peso_solo_paletas, 10)
        }
    }, [typeChange, peso, peso_solo_paletas])

    return <>
        <View style={styles.balanceInfo}>
            <Text style={styles.infoLabel}>Balanza seleccionada</Text>
            <Text style={styles.infoTitle}>{activeBalanza?.title ?? 'Sin balanza seleccionada'}</Text>
            {activeBalanza?.address ? <Text style={styles.infoText}>{activeBalanza.address}</Text> : null}
        </View>
        {loading ? <View style={styles.loadingRow}><ActivityIndicator size="small" color="#111827" /><Text style={styles.infoText}>Cargando...</Text></View> : null}
        {!bluetoothEnabled ? <DesactivadoSection loading={loading} checkBluetoothEnabled={checkBluetoothEnabled} /> : null}
        {bluetoothEnabled && !device ? <NotFoundSection connectToDevice={connectToDevice} /> : null}
        {!!device ? (
            <>
                <AppSurface style={styles.weightCard}>
                    <View style={styles.weightRow}>
                        <MaterialCommunityIcons name="bluetooth" size={24} color="#111827" />
                        <Text style={styles.weightValue}>{peso} Kg</Text>
                    </View>
                </AppSurface>
                {hasGuiasRemision && currentGuiaRemision ? (
                    <View style={styles.assignmentRow}>
                        <Text style={styles.assignmentLabel}>Se registrará para:</Text>
                        <GuiaRemisionSelect
                            guiasRemision={guiasRemision}
                            guia_remision_codigo={currentGuiaRemision.codigo}
                            onSelect={(guia:any) => {
                                setCurrentGuiaRemision(guia)
                            }}
                        />
                    </View>
                ) : null}
                {isEdit ? (
                    <>
                        <Text style={styles.summaryText}>Tara actual: {peso_solo_paletas} Kg</Text>
                        <Text style={styles.summaryText}>Tara final: {taraFinalCalculated} Kg</Text>
                        <View style={styles.radioWrap}>
                            <AppRadio label="Sumar" checked={typeChange === 'sumar'} onPress={() => setTypeChange('sumar')} />
                            <AppRadio label="Restar" checked={typeChange === 'restar'} onPress={() => setTypeChange('restar')} />
                        </View>
                    </>
                ) : null}
                <AppButton style={{ marginTop: 12 }} onPress={onPress} loading={loadingTara}>
                    Guardar
                </AppButton>
            </>
        ) : null}
    </>
}

const styles = StyleSheet.create({
    balanceInfo: {
        marginBottom: 12,
    },
    infoLabel: {
        color: "#6B7280",
        fontSize: 12,
        fontWeight: "700",
        textTransform: "uppercase",
    },
    infoTitle: {
        color: "#111827",
        fontSize: 16,
        fontWeight: "800",
        marginTop: 4,
    },
    infoText: {
        color: "#6B7280",
        fontSize: 13,
        marginTop: 2,
    },
    loadingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 12,
    },
    weightCard: {
        padding: 16,
    },
    weightRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    weightValue: {
        color: "#111827",
        fontSize: 22,
        fontWeight: "800",
        marginLeft: 10,
    },
    assignmentRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 16,
        gap: 12,
    },
    assignmentLabel: {
        color: "#111827",
        fontSize: 13,
        fontWeight: "600",
    },
    summaryText: {
        color: "#111827",
        fontSize: 15,
        fontWeight: "700",
        marginTop: 12,
    },
    radioWrap: {
        marginTop: 12,
    },
});

export default BluetoothSection;

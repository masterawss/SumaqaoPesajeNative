import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { ActivityIndicator, StyleSheet, Switch, Text, View } from "react-native";
import Sound from 'react-native-sound';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import savePesoHook from "./hook/savePesoHook";
import { BalanzaBluetoothContext } from "../../../context/BalanzaBluetoothProvider";
import DesactivadoSection from "../../../../../components/Bluetooth/DesactivadoSection";
import NotFoundSection from "../../../../../components/Bluetooth/NotFoundSection";
import { TicketContext } from "../../../Show/provider/TicketProvider";
import GuiaRemisionSelect from "../GuiaRemisionSelect";
import AppButton from "../../../../../components/ui/AppButton";
import AppSurface from "../../../../../components/ui/AppSurface";

const tiempoEstable = 1;

const BluetoothSection = () => {
    const {currentGuiaRemision, setNextGuiaRemision, setCurrentGuiaRemision} = useContext(TicketContext);
    const [isSaved, setIsSaved] = React.useState(false);
    const [canSave, setCanSave] = React.useState(false);
    const {bluetoothEnabled, loading, device, peso, connectToDevice, checkBluetoothEnabled, activeBalanza} = useContext(BalanzaBluetoothContext);

    const {loading: loadingSave, saveData} = savePesoHook()
    const [pesoEstable, setPesoEstable] = React.useState<number>(0);

    const save = useCallback(() => {
        setCronometro(-1);
        saveData({
            peso,
            by_bluetooth: true,
            guia_remision_id: currentGuiaRemision?.id
        }, () => {
            setCanSave(false);
            setIsSaved(true);
            playSound('finish')
            setNextGuiaRemision()
        })
    }, [currentGuiaRemision?.id, peso, saveData, setNextGuiaRemision]);

    useEffect(() => {
        setPesoEstable(peso);
    }, [peso]);

    const [cronometro, setCronometro] = React.useState(-1);
    useEffect(() => {
        const cronometroInterval = setInterval(() => {
          setCronometro((prevCronometro) => prevCronometro - 1);
        }, 1000);

        if (pesoEstable < peso-0.2 || pesoEstable > peso+0.2) {
          setCronometro(tiempoEstable);
          setIsSaved(false);
          setCanSave(false);
        }

        if(pesoEstable === 0 && Number(peso) === 0){
            setCronometro(-1);
        }

        return () => clearInterval(cronometroInterval);
    }, [peso, pesoEstable]);

    useEffect(() => {
        if(cronometro === 0){
            setCanSave(true);
        }else{
            setCanSave(false);
        }
        if(cronometro < 0){
            setCronometro(-1);
        }

        if(cronometro < tiempoEstable && cronometro > 0){
          playSound()
        }

    }, [cronometro]);

    useEffect(() => {
        if(canSave && peso > 0){
            save();
        }
    }, [canSave, peso, save]);

    const playSound = (type = '') => {
        const soundPath = type === 'finish' ? 'beep_finish.mp3' : 'beep.mp3';
        Sound.setCategory('Playback');
        const s = new Sound(soundPath, Sound.MAIN_BUNDLE, (e) => {
            if (e) {
                console.log('error sloading track:', e)
            } else {
                s.play(() => s.release())
            }
        })
    }

    const buttonText = useMemo(() => {
        let nextText = ''
        if(isSaved){
            nextText = 'Guardado'
        }else if(cronometro < tiempoEstable && cronometro >= 0){
            nextText = `Guardar en ${cronometro}`
        }else{
            nextText = 'Guardar'
        }
        return nextText;
    }, [isSaved, cronometro])

    return <>
        <View style={styles.balanceInfo}>
            <View style={styles.balanceRow}>
                <Text style={styles.infoTitle} numberOfLines={1}>{activeBalanza?.title ?? 'Sin balanza seleccionada'}</Text>
                {activeBalanza?.address ? <Text style={styles.infoText} numberOfLines={1}>{activeBalanza.address}</Text> : null}
            </View>
        </View>
        {loading ? <View style={styles.loadingRow}><ActivityIndicator size="small" color="#111827" /><Text style={styles.infoText}>Cargando...</Text></View> : null}
        {!bluetoothEnabled ? <DesactivadoSection loading={loading} checkBluetoothEnabled={checkBluetoothEnabled} /> : null}
        {bluetoothEnabled && !device ? <NotFoundSection connectToDevice={connectToDevice} /> : null}
        {currentGuiaRemision ? (
            <View style={styles.assignmentRow}>
                <Text style={styles.assignmentLabel}>Se registrará para:</Text>
                <GuiaRemisionSelect
                    guia_remision_codigo={currentGuiaRemision.codigo}
                    onSelect={(guia: any) => {
                        setCurrentGuiaRemision(guia);
                    }}
                />
            </View>
        ) : (
            <Text style={styles.assignmentEmpty}>Se registrará sin GRR</Text>
        )}
        {!!device ? (
            <>
                <View style={styles.resultRow}>
                    <AppSurface style={styles.weightCard}>
                        <View style={styles.weightRow}>
                            <MaterialCommunityIcons name="bluetooth" size={20} color="#111827" />
                            <View style={styles.weightTextBlock}>
                                <Text style={styles.weightLabel}>Peso actual</Text>
                                <Text style={styles.weightValue}>{peso} Kg</Text>
                            </View>
                        </View>
                    </AppSurface>
                    <AppButton style={styles.saveButton} disabled={isSaved || peso === 0} onPress={save} loading={loadingSave}>
                        {buttonText}
                    </AppButton>
                </View>
                {cronometro > 0 && cronometro < tiempoEstable ? (
                    <Text style={styles.helpText}>Puedes pulsar para guardar el valor estable.</Text>
                ) : null}
            </>
        ) : null}
    </>
}

const styles = StyleSheet.create({
    balanceInfo: {
        marginBottom: 8,
    },
    balanceRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        minHeight: 24,
    },
    infoTitle: {
        color: "#111827",
        flex: 1,
        fontSize: 14,
        fontWeight: "800",
    },
    infoText: {
        color: "#6B7280",
        fontSize: 12,
        flexShrink: 0,
    },
    loadingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 10,
    },
    assignmentRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 10,
        gap: 8,
    },
    assignmentLabel: {
        color: "#111827",
        fontSize: 12,
        fontWeight: "600",
    },
    assignmentEmpty: {
        color: "#6B7280",
        fontSize: 12,
        marginBottom: 10,
    },
    resultRow: {
        flexDirection: "row",
        alignItems: "stretch",
        gap: 8,
        marginTop: 2,
    },
    weightCard: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    weightRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    weightTextBlock: {
        flex: 1,
        marginLeft: 8,
    },
    weightLabel: {
        color: "#6B7280",
        fontSize: 11,
        fontWeight: "700",
        textTransform: "uppercase",
    },
    weightValue: {
        color: "#111827",
        fontSize: 19,
        fontWeight: "800",
    },
    saveButton: {
        alignSelf: "stretch",
        paddingHorizontal: 12,
    },
    helpText: {
        color: "#6B7280",
        fontSize: 12,
        marginTop: 6,
    },
});

export default BluetoothSection;

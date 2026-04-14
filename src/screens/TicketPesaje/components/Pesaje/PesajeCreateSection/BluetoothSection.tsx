import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { Button, Icon, Text } from "react-native-paper";
import { ActivityIndicator, View } from "react-native";
import savePesoHook from "./hook/savePesoHook";
import { BalanzaBluetoothContext } from "../../../context/BalanzaBluetoothProvider";
import DesactivadoSection from "../../../../../components/Bluetooth/DesactivadoSection";
import NotFoundSection from "../../../../../components/Bluetooth/NotFoundSection";
import Sound from 'react-native-sound';
import { TicketContext } from "../../../Show/provider/TicketProvider";
import GuiaRemisionSelect from "../GuiaRemisionSelect";

const tiempoEstable = 1;

const BluetoothSection = () => {
    const {currentGuiaRemision, setNextGuiaRemision, setCurrentGuiaRemision} = useContext(TicketContext);
    const [isSaved, setIsSaved] = React.useState(false);
    const [canSave, setCanSave] = React.useState(false);
    // const [peso, setPeso] = React.useState<number>(0);
    // const randomPeso = () => {
    //     setPeso(Math.random() * 100);
    // }
    // const {bluetoothEnabled, loading, device, connectToDevice, checkBluetoothEnabled} = useContext(BalanzaBluetoothContext);
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
        setPesoEstable(peso); // Actualiza el valor de pesoEstable cuando el peso cambia
    }, [peso]);

    const [cronometro, setCronometro] = React.useState(-1);
    useEffect(() => {
        const cronometroInterval = setInterval(() => {
          setCronometro((prevCronometro) => prevCronometro - 1);
        }, 1000);

        // Reinicia el cronómetro cuando el peso cambia
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
        <View style={{ marginBottom: 16 }}>
            <Text style={{ color: 'grey', fontSize: 12 }}>Balanza seleccionada</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                {activeBalanza?.title ?? 'Sin balanza seleccionada'}
            </Text>
            {
                activeBalanza?.address
                    ? <Text style={{ color: 'grey' }}>{activeBalanza.address}</Text>
                    : null
            }
        </View>
        {
            loading && <Text><ActivityIndicator size="small" /> Cargando ...</Text>
        }
        {
            !bluetoothEnabled && <DesactivadoSection loading={loading} checkBluetoothEnabled={checkBluetoothEnabled} />
        }
        {
            bluetoothEnabled && !device && <NotFoundSection connectToDevice={connectToDevice} />
        }
        {
            currentGuiaRemision
            ? <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, marginBottom: 20 }}>
                <Text>
                    Se registrará para:
                </Text>
                <GuiaRemisionSelect
                    guia_remision_codigo={currentGuiaRemision.codigo} 
                    onSelect={(guia: any) => {
                        setCurrentGuiaRemision(guia);
                    }}
                />
            </View>
            : <Text>
                Se registrará sin GRR
            </Text>
        }
        {
            !!device && <>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <Icon source="bluetooth" size={30} />
                        <Text style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 20 }}>{peso} Kg</Text>
                    </View>
                </View>
                <View style={{ marginTop: 15 }}>
                    <Button disabled={isSaved || peso === 0} mode="contained" onPress={save} loading={loadingSave}>
                        {buttonText}
                    </Button>
                    <View>
                        {
                            cronometro > 0 && cronometro < tiempoEstable && <Text style={{ color: 'grey', fontSize: 12 }}>* Puedes hacer click para guardar el valor</Text>
                        }
                    </View>
                </View>
            </> 
        }
    </>
}

export default BluetoothSection;

import React, { useContext, useEffect, useMemo } from "react";
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import { Button, Icon, IconButton, Text } from "react-native-paper";
import { ActivityIndicator, PermissionsAndroid, View } from "react-native";
import Snackbar from "react-native-snackbar";
import savePesoHook from "./hook/savePesoHook";
import { BalanzaBluetoothContext } from "../../../context/BalanzaBluetoothProvider";
import DesactivadoSection from "../../../../../components/Bluetooth/DesactivadoSection";
import NotFoundSection from "../../../../../components/Bluetooth/NotFoundSection";
import Sound from 'react-native-sound';

const tiempoEstable = 4;

const BluetoothSection = () => {
    const [isSaved, setIsSaved] = React.useState(false);
    const [canSave, setCanSave] = React.useState(false);
    // const [peso, setPeso] = React.useState<number>(0);
    // const randomPeso = () => {
    //     setPeso(Math.random() * 100);
    // }
    // const {bluetoothEnabled, loading, device, connectToDevice, checkBluetoothEnabled} = useContext(BalanzaBluetoothContext);
    const {bluetoothEnabled, loading, device, peso, connectToDevice, checkBluetoothEnabled} = useContext(BalanzaBluetoothContext);

    const {loading: loadingSave, error, saveData} = savePesoHook()
    const [pesoEstable, setPesoEstable] = React.useState<number>(0);

    const save = () => { 
        setCronometro(-1);
        console.log('save');
        saveData(peso, true, () => {
            setCanSave(false);
            setIsSaved(true);
            playSound('finish')
        })
    }

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

        if(pesoEstable === 0 && peso == 0){
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
            console.log('save');
        }
    }, [canSave, peso]);


    const [sound, setSound] = React.useState();
    useEffect(() => {
        return () => {
          if (sound) sound.release(); // Limpia el sonido al desmontar el componente
        };
    }, [sound]);
    const playSound = (type = '') => {
        const soundPath = type === 'finish' ? 'beep_finish.mp3' : 'beep.mp3';
        // const sound = '../../../../../../assets/sound/beep-finish.mp3'
        Sound.setCategory('Playback');
        const s = new Sound(soundPath, Sound.MAIN_BUNDLE, (e) => {
            if (e) {
                console.log('error sloading track:', e)
            } else {
                s.play(() => s.release())
            }
        })
    }

    const text = useMemo(() => {
        let text = ''
        if(isSaved){
            text = 'Guardado'
        }else if(cronometro < tiempoEstable && cronometro >= 0){
            text = `Guardar en ${cronometro}`
        }else{
            text = 'Guardar'
        }
        return text;
    }, [isSaved, cronometro, tiempoEstable])

    return <>
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
            !!device && <>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <Icon source="bluetooth" size={30} />
                        <Text style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 20 }}>{peso} Kg</Text>
                    </View>
                </View>
                <View style={{ marginTop: 15 }}>
                    <Button disabled={isSaved || peso === 0} mode="contained" onPress={save} loading={loadingSave}>
                        {text}
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
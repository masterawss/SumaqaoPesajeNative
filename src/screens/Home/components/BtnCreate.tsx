import React from "react";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import api from "../../../utils/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import Snackbar from "react-native-snackbar";
import { Button, IconButton } from "react-native-paper";

const BtnCreate = ({type = 'ingreso'}) => {
    const navigation = useNavigation();
    const [loading, setLoading] = React.useState(false);
    const create = async () => {
        setLoading(true);
        const user = await AsyncStorage.getItem('user');
        api.post('/ticket_pesaje/store', {
            type,
            created_user_id: JSON.parse(user || "")?.id
        }).then((response) => {
            console.log(response.data.id);
            // ingreso.show o exportacion.show
            navigation.navigate('ticket_pesaje.show' as never, {id: response.data.id} as never);
        }).catch((error) => {
            console.log('ERROR', error.response.data);
            Snackbar.show({
                text: 'No se pudo crear el registro',
                duration: Snackbar.LENGTH_INDEFINITE,
                action: {
                  text: 'Cerrar',
                  textColor: 'red',
                  onPress: () => { /* Do something. */ },
                },
              });
        }).finally(() => {
            setLoading(false);
        })
    }

    return <>
    {
        loading 
            ? <ActivityIndicator  style={{ marginRight: 15 }} color="#0000ff" />
            : <IconButton icon="plus" disabled={loading} onPress={create} />
    }
    </>

{/* <TouchableOpacity style={{ position: 'absolute', paddingHorizontal: 20, paddingVertical: 10, bottom:0, right:0, margin: 10, borderRadius: 100, backgroundColor: 'orange' }} disabled={loading} onPress={create}>
<Text style={{ color: 'white' }}>Crear ticket</Text>
</TouchableOpacity> */}
}

export default BtnCreate;
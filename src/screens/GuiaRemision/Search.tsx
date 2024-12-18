import { Appbar, Text, Searchbar, Button, Icon, IconButton } from "react-native-paper"
import { SafeAreaView, ScrollView, View, ImageBackground } from "react-native"
import React, { useContext, useEffect } from "react";
import SimpleCard from "../../components/Ticket/SimpleCard";
import SimpleCardGuiaRemision from "./components/SimpleCard";
import api from "../../utils/axios";
import Snackbar from "react-native-snackbar";
import { TicketContext } from "../TicketPesaje/Show/provider/TicketProvider";
import Bg from '../../../assets/img/bg/7.jpg';

const Search = ({navigation, route}:any) => {
    const { ticketId } = route.params || { id: null };
    const {assignReload} = useContext(TicketContext);

    const [searchQuery, setSearchQuery] = React.useState('');

    const onChangeSearch = (query: any) => setSearchQuery(query);

    const [loading, setLoading] = React.useState(false);
    const [guiasRemision, setGuiasRemision] = React.useState<any>([]);
    const [hasError, setHasError] = React.useState(false);

    useEffect(() => {
        if(searchQuery.length > 2){
            search()
        }
    }, [searchQuery])

    useEffect(() => {
        return () => assignReload(true);
    }, [])

    const search = () => {
        setLoading(true);
        setHasError(false);
        api.get('/guia_remision/search/'+searchQuery, {
            params: {
                ticket_pesaje_id: ticketId
            }
        }).then((response) => {
            console.log(response.data);
            setGuiasRemision(response.data.guias_remision);
        }).catch((error) => {
            console.log(error.response);
            setHasError(true);
            Snackbar.show({
                text: 'No se pudo obtener los datos desde el servidor',
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

    return (
        <SafeAreaView>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => {navigation.goBack()}} />
                <Appbar.Content title="Buscar guía de remisión" />
            </Appbar.Header>
            <ScrollView style={{ backgroundColor: '#F7f7f7', height: '100%' }}>
                <ImageBackground source={Bg} style={{ padding: 10}}>
                    <SimpleCard id={ticketId} />
                </ImageBackground>
                <View style={{ padding: 10 }}>
                    <Text style={{ marginTop: 2, color: 'grey', fontSize: 12 }}>
                        Busca por el código de guía o la placa del vehículo
                    </Text>
                    <View style={{ display: 'flex' }}>
                        <Searchbar
                            loading={loading}
                            placeholder="Buscar por código o placa"
                            onChangeText={onChangeSearch}
                            value={searchQuery}
                        />
                    </View>
                    <View style={{ paddingHorizontal: 10,paddingVertical:10, marginBottom: 60 }}>
                        {
                            guiasRemision.map((guia: any) => <SimpleCardGuiaRemision key={guia.id} ticketId={ticketId} guiaRemision={guia} />)
                        }
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>

    )
}

export default Search
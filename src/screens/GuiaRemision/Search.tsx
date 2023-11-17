import { Appbar, Text, Searchbar, Button, Icon, IconButton } from "react-native-paper"
import { SafeAreaView, ScrollView, View } from "react-native"
import React, { useEffect } from "react";
import SimpleCard from "../../components/Ticket/SimpleCard";
import SimpleCardGuiaRemision from "./components/SimpleCard";
import api from "../../utils/axios";
import Snackbar from "react-native-snackbar";
const Search = ({navigation, route}:any) => {
    const { ticketId } = route.params || { id: null };
    
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

    const search = () => {
        setLoading(true);
        setHasError(false);
        api.get('/guia_remision/search/'+searchQuery, {
            params: {
                ticket_id: ticketId
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
            <View style={{ padding: 10 }}>
                <View style={{ marginBottom: 10 }}>
                    <SimpleCard id={ticketId} />
                </View>
                <Text style={{ marginTop: 10, color: 'grey', fontSize: 12 }}>
                    Busca por el código de guía o la placa del vehículo
                </Text>
                <View style={{ display: 'flex' }}>
                    <Searchbar
                        loading={loading}
                        placeholder="Search"
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                    />
                </View>

                <ScrollView>
                    <View style={{ paddingHorizontal: 10,paddingVertical:10 }}>
                        {
                            guiasRemision.map((guia: any) => <SimpleCardGuiaRemision key={guia.id} ticketId={ticketId} guiaRemision={guia} />)
                            
                            // <View style={{ padding: 10, borderRadius: 10, backgroundColor: '#f5f5f5' }}>
                            //         <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            //             <Text>CODIGO: {guia.codigo}</Text>
                            //             {
                            //                 guia.ticket_pesaje_id === ticketId 
                            //                 ? <IconButton icon="delete" onPress={deleteGuia} />
                            //                 : <IconButton icon="add" onPress={addGuia} />
                            //             }
                            //         </View>
                            //         <Text>Tracto: {guia.tracto.placa}</Text>
                            //         <Text>Placa: {guia.carreta.placa}</Text>
                            //     </View>
                            // )
                        }
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>

    )
}

export default Search
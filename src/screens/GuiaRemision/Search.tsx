import { ScrollView, View, Text, TextInput, StyleSheet } from "react-native"
import React, { useContext, useEffect } from "react";
import SimpleCard from "../../components/Ticket/SimpleCard";
import SimpleCardGuiaRemision from "./components/SimpleCard";
import api from "../../utils/axios";
import { TicketContext } from "../TicketPesaje/Show/provider/TicketProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AppIconButton from "../../components/ui/AppIconButton";
const Snackbar = require("react-native-snackbar");

const Search = ({navigation, route}:any) => {
    const { ticketId } = route.params || { id: null };
    const {assignReload} = useContext(TicketContext) as any;
    const insets = useSafeAreaInsets();

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
        <View style={[{ flex: 1, backgroundColor: "#F7f7f7" }, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <AppIconButton icon="chevron-left" onPress={() => {navigation.goBack()}} />
                    <Text style={styles.headerTitle}>Buscar guía de remisión</Text>
                </View>
            </View>
            <ScrollView
                style={{ flex: 1, backgroundColor: '#F7f7f7' }}
                contentContainerStyle={{ paddingBottom: 60 + insets.bottom }}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ padding: 12 }}>
                    <SimpleCard id={ticketId} />
                </View>
                <View style={{ paddingHorizontal: 12 }}>
                    <Text style={{ marginTop: 2, color: '#6B7280', fontSize: 12 }}>
                        Busca por el código de guía o la placa del vehículo
                    </Text>
                    <View style={styles.searchField}>
                        <MaterialCommunityIcons name="magnify" size={18} color="#6B7280" />
                        <TextInput
                            placeholder="Buscar por código o placa"
                            placeholderTextColor="#9CA3AF"
                            onChangeText={onChangeSearch}
                            value={searchQuery}
                            style={styles.searchInput}
                        />
                        {loading ? <MaterialCommunityIcons name="loading" size={18} color="#111827" /> : null}
                    </View>
                    <View style={{ paddingVertical: 10 }}>
                        {
                            guiasRemision.map((guia: any) => <SimpleCardGuiaRemision key={guia.id} ticketId={ticketId} guiaRemision={guia} />)
                        }
                    </View>
                </View>
            </ScrollView>
        </View>

    )
}

const styles = StyleSheet.create({
    header: {
        minHeight: 68,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        justifyContent: "center",
        paddingHorizontal: 12,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    headerTitle: {
        color: "#111827",
        fontSize: 18,
        fontWeight: "800",
    },
    searchField: {
        minHeight: 48,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#D1D5DB",
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 14,
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    searchInput: {
        flex: 1,
        color: "#111827",
        fontSize: 14,
        paddingVertical: 10,
    },
});

export default Search

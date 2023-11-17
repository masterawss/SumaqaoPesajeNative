import { Button, Text } from "react-native-paper"
import { useCallback, useContext, useMemo, useRef, useState } from "react";
import {View, StyleSheet, ScrollView} from 'react-native';
import SimpleCard from "../../GuiaRemision/components/SimpleCard";
import { TicketContext } from "../Show/provider/TicketProvider";
import { useNavigation } from "@react-navigation/native";
import { numberFormat } from "../../../utils/numberFormat";

const GuiaRemision = () => {
    const [open, setOpen] = useState(false);
    const { loading, hasError, loadTicket, ticketPesaje, deleteTicket } = useContext(TicketContext);
    const navigation = useNavigation();
    return <ScrollView>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <View style={{ marginBottom: 5 }}>
                <Text style={{ marginVertical: 5, fontWeight: 'bold', color: 'grey', fontSize: 15    }}>Lista de guías de remisión</Text>
                <Text style={{ color: 'grey' }}>
                    Total peso neto: {numberFormat(ticketPesaje.total_grr_peso_neto_enviado)} kg
                </Text>
                <Text style={{ color: 'grey' }}>
                    Total de sacos: {numberFormat(ticketPesaje.total_grr_sacos)}
                </Text>
            </View>
                <Button mode="contained"
                    onPress={() => navigation.navigate('guia_remision.search', {ticketId: ticketPesaje.id})}
                >
                    Agregar guía
                </Button>
        </View>
        {
            ticketPesaje.guias_remision.map((guia_remision: any) => <View key={guia_remision.id} style={{ marginVertical: 10, marginHorizontal: 5 }}>
                <SimpleCard guiaRemision={guia_remision} ticketId={ticketPesaje.id} isInTicket={true} />
            </View>)
        }
    </ScrollView>
}

export default GuiaRemision;
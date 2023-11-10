import { Button, Text } from "react-native-paper"
import { useCallback, useContext, useMemo, useRef, useState } from "react";
import {View, StyleSheet, ScrollView} from 'react-native';
import SimpleCard from "../../GuiaRemision/components/SimpleCard";
import { TicketContext } from "../Show/provider/TicketProvider";
import { useNavigation } from "@react-navigation/native";

const GuiaRemision = () => {
    const [open, setOpen] = useState(false);
    const { loading, hasError, loadTicket, ticketPesaje, deleteTicket } = useContext(TicketContext);
    const navigation = useNavigation();
    return <ScrollView>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text style={{ marginVertical: 10, fontWeight: 'bold', color: 'grey' }}>Lista de guías de remisión</Text>
                <Button mode="contained"
                    onPress={() => navigation.navigate('guia_remision.search', {ticketId: ticketPesaje.id})}
                >
                    Agregar guía
                </Button>
        </View>
        {
            ticketPesaje.guias_remision.map((guia_remision: any) => <View key={guia_remision.id} style={{ marginVertical: 10 }}>
                <SimpleCard guiaRemision={guia_remision} ticketId={ticketPesaje.id} isInTicket={true} />
            </View>)
        }
    </ScrollView>
}

export default GuiaRemision;
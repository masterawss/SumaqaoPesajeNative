import { useContext } from 'react';
import {View} from 'react-native'
import { Text } from 'react-native-paper';
import { TicketContext } from '../Show/provider/TicketProvider';
const Resumen = () => {
    const { loading, hasError, loadTicket, ticketPesaje, deleteTicket } = useContext(TicketContext);

    return <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', color: 'grey' }}>Kg bruto</Text>
            <Text>{ticketPesaje.peso_bruto}</Text>
        </View>
        {/* 
            -- variable peso_por_paleta = pesaketIcket.tara_paletas / pesajeTicket.detalles.count
            Peso total de paletas + sacos = pesajetTicket.detalle.sum('peso_bruto') + pesajeTicket.peso_solo_paletas
            Tara de paletas: 
            Peso bruto recepcionado = pesajetTicket.detalle.sum('peso_bruto') - pesajeTicket.peso_solo_paletas
            Tara de sacos: pesajeTicket.nro_sacos * pasajeTicket.saco_color.tara_kg
            Peso neto recepcionado = pesajetTicket.detalle.sum('peso_bruto') - pasajeTicket.saco_color.tara_kg
            Diferencia de peso = Peso neto enviado (Aparece ne a guia de remision) - Peso neto recepcionado
        */}
    </View>
}

export default Resumen;
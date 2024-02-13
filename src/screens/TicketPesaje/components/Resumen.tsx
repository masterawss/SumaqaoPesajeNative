import { useContext, useEffect } from 'react';
import {View} from 'react-native'
import { Button, Divider, Text } from 'react-native-paper';
import { TicketContext } from '../Show/provider/TicketProvider';
import { numberFormat } from '../../../utils/numberFormat';
const Resumen = () => {
    const { loading, hasError, loadTicket, ticketPesaje, deleteTicket, saveTicket } = useContext(TicketContext);

    const haveToResetTicket = async () => {
        const resetTicket = await AsyncStorage.getItem('resetTicket');
        if(resetTicket == "1"){
            loadTicket();
            await AsyncStorage.setItem('resetTicket', "0");
        }
    }

    useEffect(() => {
        haveToResetTicket();
    },[])

    return <View style={{
        marginHorizontal: 10,
        padding: 10, borderRadius: 10, marginVertical: 4,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3, 
    }}>
        <Item label="Peso total de paletas + sacos" value={numberFormat(ticketPesaje.peso_total_paletas_mas_sacos) + ' Kg'} />
        <Item label="Tara de paletas" value={numberFormat(ticketPesaje.peso_solo_paletas) + ' Kg'} />
        <Item label="Peso bruto repecionado" value={numberFormat(ticketPesaje.peso_bruto_recepcionado) + ' Kg'} />
        <Item label="Tara de sacos" value={numberFormat(ticketPesaje.tara_sacos) + ' Kg'} />
        <Item label="Peso neto recepcionado" value={
            <Text style={{ fontWeight: 'bold' }}>
                {numberFormat(ticketPesaje.peso_neto_recepcionado) + ' Kg'}
            </Text>
        } />
        <Item label="Diferencia de peso" value={
            <Text style={{ color: ticketPesaje.diferencia_peso < 0 ? 'red' : 'green' }}>
                {numberFormat(ticketPesaje.diferencia_peso) + ' Kg'}
            </Text>
        } />
        <Item label="Peso promedio de saco" value={numberFormat(ticketPesaje.peso_promedio_saco) + ' Kg'} />
        <Divider style={{ marginVertical: 10 }} />
        <Item label={<Text style={{ fontStyle: 'italic', color: 'grey' }}>Capacidad de saco deseada</Text>} 
            value={<Text style={{ fontStyle: 'italic', color: 'grey' }}>{numberFormat(ticketPesaje.peso_saco_deseado) + ' Kg'}</Text>} 
        />
        {/* 
            -- variable peso_por_paleta = pesaketIcket.tara_paletas / pesajeTicket.detalles.count
            Peso total de paletas + sacos = pesajetTicket.detalle.sum('peso_bruto') + pesajeTicket.peso_solo_paletas
            Tara de paletas: 
            Peso bruto recepcionado = pesajetTicket.detalle.sum('peso_bruto') - pesajeTicket.peso_solo_paletas
            Tara de sacos: pesajeTicket.nro_sacos * pasajeTicket.saco_color.tara_kg
            Peso neto recepcionado = pesajetTicket.detalle.sum('peso_bruto') - pasajeTicket.saco_color.tara_kg
            Diferencia de peso = Peso neto enviado (Aparece ne a guia de remision) - Peso neto recepcionado
        */}
        {
            !ticketPesaje.is_saved && 
                <Button onPress={saveTicket} loading={loading} style={{ width: '100%', marginTop: 20 }} mode='contained'>Guardar</Button>
        }
    </View>
}

const Item = ({ label, value }: { label: string|Element, value: string|Element }) => {
    return <View style={{ flexDirection: 'row', marginVertical: 15, justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', color: 'grey' }}>{label}</Text>
        <Text>{value}</Text>
    </View>
}

export default Resumen;
import { ScrollView, TouchableOpacity, View } from 'react-native';
import GuiaRemision from '../components/GuiaRemision';
import Pesaje from '../components/Pesaje';
import { Button, Text } from 'react-native-paper';
import { useContext, useState } from 'react';
import Resumen from '../components/Resumen';
import Saco from '../components/Saco';
import { TicketContext } from './provider/TicketProvider';

const TabsSection = () => {
    const [tab, setTab] = useState('guia_remision');
    const { ticketPesaje } = useContext(TicketContext);

    return <View>
        <View style={{ paddingHorizontal: 15, marginTop: 15, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={() => setTab('guia_remision')} style={{ alignItems: 'center' }}>
                <Text style={{ fontWeight: tab === 'guia_remision' ? 'bold' : 'normal', color: tab === 'guia_remision' ? 'orange' : 'black' }}>Guía de remisión</Text>
                <View style={{ height: 3, marginTop: 5, borderRadius: 10, backgroundColor: tab === 'guia_remision' ? 'orange' : 'grey', width: tab === 'guia_remision' ? 50 : 5 }}></View>
            </TouchableOpacity>
            {
                !ticketPesaje.is_exportacion &&
                <TouchableOpacity onPress={() => setTab('saco')} style={{ alignItems: 'center' }}>
                    <Text style={{ fontWeight: tab === 'saco' ? 'bold' : 'normal', color: tab === 'saco' ? 'orange' : 'black' }}>Sacos</Text>
                    <View style={{ height: 3, marginTop: 5, borderRadius: 10, backgroundColor: tab === 'saco' ? 'orange' : 'grey', width: tab === 'saco' ? 50 : 5 }}></View>
                </TouchableOpacity>
            }
            <TouchableOpacity onPress={() => setTab('pesaje')} style={{ alignItems: 'center' }}>
                <Text style={{ fontWeight: tab === 'pesaje' ? 'bold' : 'normal', color: tab === 'pesaje' ? 'orange' : 'black' }}>Pesaje</Text>
                <View style={{ height: 3, marginTop: 5, borderRadius: 10, backgroundColor: tab === 'pesaje' ? 'orange' : 'grey', width: tab === 'pesaje' ? 50 : 5 }}></View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTab('resumen')} style={{ alignItems: 'center' }}>
                <Text style={{ fontWeight: tab === 'resumen' ? 'bold' : 'normal', color: tab === 'resumen' ? 'orange' : 'black' }}>Resumen</Text>
                <View style={{ height: 3, marginTop: 5, borderRadius: 10, backgroundColor: tab === 'resumen' ? 'orange' : 'grey', width: tab === 'resumen' ? 50 : 5 }}></View>
            </TouchableOpacity>
        </View>
        <ScrollView style={{ paddingHorizontal: 15 }}>
            <Tab tab={tab}/>
        </ScrollView>
    </View>
}

const Tab = ({tab}: {tab: string}) => {
    switch (tab) {
        case 'guia_remision':
            return <GuiaRemision />
        case 'pesaje':
            return <Pesaje />
        case 'saco':
            return <Saco />
        // case 'sacos_recibidos':
        //     return <Sa />
        default:
            return <Resumen />
    }
}

export default TabsSection;
import { ScrollView, View } from 'react-native';
import GuiaRemision from '../components/GuiaRemision';
import Pesaje from '../components/Pesaje';
import { Button, Text } from 'react-native-paper';
import { useState } from 'react';
import Resumen from '../components/Resumen';

const TabsSection = () => {
    const [tab, setTab] = useState('guia_remision');

    return <View>
        <View style={{ paddingHorizontal: 15, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button style={{ marginRight: 10 }} compact mode={tab === 'guia_remision' ? 'outlined' : 'text'} onPress={() => setTab('guia_remision')}>Guía remisión</Button>
            <Button style={{ marginRight: 10 }} compact mode={tab === 'pesaje' ? 'outlined' : 'text'} onPress={() => setTab('pesaje')}>Pesaje</Button>
            {/* <Button style={{ marginRight: 10 }} compact mode={tab === 'sacos_recibidos' ? 'outlined' : 'text'} onPress={() => setTab('sacos_recibidos')}>Sacos recibidos</Button> */}
            <Button style={{ marginRight: 10 }} compact mode={tab === 'resumen' ? 'outlined' : 'text'} onPress={() => setTab('resumen')}>Resumen</Button>
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
        // case 'sacos_recibidos':
        //     return <Sa />
        default:
            return <Resumen />
    }
}

export default TabsSection;
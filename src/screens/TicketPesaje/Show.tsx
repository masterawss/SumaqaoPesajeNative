
import { TicketContext } from './Show/provider/TicketProvider';
import Header from './Show/Header';
import Body from './Show/Body';
import { View } from 'react-native';
import { useContext, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface IIngreso {
    id: number;
    fecha: string;
    proveedor: string;
    tipo: string;
    numero: string;
    observaciones: string;
    estado: string;
    created_at: string;
    updated_at: string;
}

const ShowScreen = ({ navigation, route }: any) => {
    const { id } = route.params || { id: null };
    const ticketContext = useContext(TicketContext);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        ticketContext.setId(id);
    }, [id])

    useEffect(() => {
        if(ticketContext.reload){
            ticketContext.loadTicket();
            ticketContext.assignReload(false)
        }
    }, [ticketContext.reload])

    return <View style={{ flex: 1, paddingTop: insets.top }}>
            <Header />
            <Body />
    </View>
}

export default ShowScreen;

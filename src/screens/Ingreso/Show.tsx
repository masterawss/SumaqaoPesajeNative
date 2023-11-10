
import TicketProvider from './Show/provider/TicketProvider';
import Header from './Show/Header';
import Body from './Show/Body';
import { View } from 'react-native';

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

    return <View>
        <TicketProvider ticketId={id}>
            <Header />
            <Body />
        </TicketProvider>
    </View>
}

export default ShowScreen;
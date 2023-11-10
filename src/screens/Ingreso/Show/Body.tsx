import LottieView from 'lottie-react-native';
import { Text } from 'react-native-paper';
import TabsSection from './TabsSection';
import { View } from 'react-native';
import SimpleCard from '../../../components/Ticket/SimpleCard';
import { useContext } from 'react';
import { TicketContext } from './provider/TicketProvider';
import ErrorSection from '../../../components/ErrorSection';

const Body = () => {

    const { loading, hasError, loadTicket, ticketPesaje } = useContext(TicketContext);

    return <>
        {
            loading && <>
                <LottieView style={{ height: 250 }} source={require("../../../../assets/lottie/loading.json")} autoPlay loop />
                <Text style={{ textAlign: 'center', color: 'grey', fontWeight: 'bold', marginTop: 20 }}>Cargando...</Text>
            </>
        }
        {
            hasError && <ErrorSection message="No se pudo obtener los datos desde el servidor" 
                onRetry={loadTicket}
            />
        }
        {
            !loading && !hasError && ticketPesaje && <>
                <View style={{ paddingVertical: 10 }}>
                    <SimpleCard canEdit={true} />
                </View>
                <TabsSection/>
            </>
        }
    </>
}
export default Body;
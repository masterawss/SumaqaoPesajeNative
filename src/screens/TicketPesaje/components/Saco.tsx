import React, { useContext } from 'react';
import { Text, View } from 'react-native';
import { TicketContext } from '../Show/provider/TicketProvider';
import SimpleCard from './Saco/SimpleCard';

const Saco = () => {
    const [visible, setVisible] = React.useState(false);
    const { loading, loadTicket, ticketPesaje, hasError } = useContext(TicketContext);

    return <View style={{ padding: 10, paddingTop: 0 }}>
        <Text style={{ marginVertical: 10, fontWeight: 'bold', color: 'grey' }}>Sacos recibidos</Text>

        <SimpleCard col={1} nroItem={1} />
        <SimpleCard col={2} nroItem={2} />
    </View>
}

export default Saco;
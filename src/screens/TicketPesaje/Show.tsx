
import { TicketContext } from './Show/provider/TicketProvider';
import Header from './Show/Header';
import Body from './Show/Body';
import LinearGradient from 'react-native-linear-gradient';
import { StatusBar, StyleSheet, View } from 'react-native';
import { useContext, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ShowScreen = ({ route }: any) => {
    const { id } = route.params || { id: null };
    const { setId, reload, loadTicket, assignReload } = useContext(TicketContext) as any;
    const insets = useSafeAreaInsets();

    useEffect(() => {
        setId(id);
    }, [id, setId])

    useEffect(() => {
        if(reload){
            loadTicket();
            assignReload(false)
        }
    }, [assignReload, loadTicket, reload])

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="dark-content" backgroundColor="#EDF2F5" />
            <LinearGradient
                colors={["#EDF2F5", "#F7F9FB", "#EEF2F6"]}
                locations={[0, 0.55, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.background}
            />

            <View style={[styles.content, { paddingTop: insets.top }]}>
                <Header />
                <Body />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#E7EDF2",
        overflow: "hidden",
    },
    background: {
        ...StyleSheet.absoluteFillObject,
    },
    content: {
        flex: 1,
    },
});

export default ShowScreen;

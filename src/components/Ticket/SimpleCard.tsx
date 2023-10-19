import { Button, Text } from "react-native-paper";
import { View } from "react-native";

const SimpleCard = () => {
    return (
        <View style={{ padding: 10, backgroundColor: '#f5f5f5', borderRadius: 10 }}>

                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Text variant="titleMedium">TP0021</Text>
                        <View style={{ borderRadius: 40, backgroundColor: 'teal', paddingHorizontal: 8, marginLeft: 8 }}>
                            <Text style={{ color: 'white', fontSize: 12 }}>Terminado</Text>

                        </View>
                    </View>
                    <View >
                        <Text style={{ color: 'silver', fontSize: 12 }}>Martes 28 Julio 2022</Text>
                    </View>
                </View>
                <View style={{ display: 'flex', marginTop: 13, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: 'grey', fontSize: 14 }}>
                            3 guías rem.   •   200 sacos recib.   •   142 kg bruto
                        </Text>
                    </View>
                </View>
            </View>
    );
}
export default SimpleCard;
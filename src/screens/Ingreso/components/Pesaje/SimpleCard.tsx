import { View } from "react-native"
import { Button, IconButton, MD3Colors, Text } from "react-native-paper"

const SimpleCard = () => {
    return (
        <View style={{
            padding: 10, borderRadius: 10, marginVertical: 4,
            display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
            backgroundColor: "#f5f5f5",
        }}>
            <View>
                <Text style={{ fontWeight: 'bold' }}>1</Text>
                <Text>Peso bruto + paleta</Text>
            </View>
            <IconButton
                icon="delete"
                iconColor='grey'
                size={20}
                onPress={() => console.log('Pressed')}
            />
        </View>
    )
}

export default SimpleCard;
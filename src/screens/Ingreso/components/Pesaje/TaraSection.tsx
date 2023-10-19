import { View } from "react-native"
import { IconButton, Text } from "react-native-paper"

const TaraSection = ({ navigation }: any) => {
    return (
        <>
            <Text style={{ marginVertical: 10, fontWeight: 'bold', color: 'grey' }}>Tara de paletas</Text>

            <View style={{
                padding: 10, borderRadius: 10, marginVertical: 4,
                display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
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
                <Text style={{ fontWeight: 'bold' }}>0 Kg</Text>
                <IconButton
                    icon="pencil"
                    iconColor='grey'
                    size={20}
                    onPress={() => console.log('Pressed')}
                />
            </View>
        </>
    )
}

export default TaraSection;
import LottieView from "lottie-react-native";
import { View } from "react-native"
import { Button, IconButton, MD3Colors, Text } from "react-native-paper"

const ErrorSection = ({
    message = 'Ha ocurrido un error',
    icon = 'alert',
    iconColor = MD3Colors.error50,
    onRetry = () => {}
}) => {
    return <View style={{ padding: 20}}>
        {/* <IconButton
            style={{ alignSelf: 'center' }}
            icon={icon}
            iconColor={iconColor}
            size={80}
            disabled={true}
        /> */}
        <LottieView style={{ height: 150 }} source={require("../../assets/lottie/not_found.json")} autoPlay loop />
        <Text style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 10, marginTop: 10 }}>Ha ocurrido un error</Text>
        <Text style={{ textAlign: 'center' }}>{message}</Text>
        <Button style={{ marginTop: 10 }} mode="elevated" icon="reload" onPress={onRetry}>
            Reintentar
        </Button>
    </View>
}

export default ErrorSection;
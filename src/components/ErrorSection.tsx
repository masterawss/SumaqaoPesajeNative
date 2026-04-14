import LottieView from "lottie-react-native";
import { View, Text, StyleSheet } from "react-native";

import AppButton from "./ui/AppButton";
import AppSurface from "./ui/AppSurface";

const ErrorSection = ({
    message = "Ha ocurrido un error",
    onRetry = () => {},
}) => {
    return (
        <View style={styles.container}>
            <AppSurface style={styles.card}>
                <LottieView
                    style={styles.animation}
                    source={require("../../assets/lottie/not_found.json")}
                    autoPlay
                    loop
                />
                <Text style={styles.title}>Algo salió mal</Text>
                <Text style={styles.message}>{message}</Text>
                <AppButton onPress={onRetry} style={styles.button}>
                    Reintentar
                </AppButton>
            </AppSurface>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
    },
    card: {
        borderRadius: 16,
        padding: 18,
        alignItems: "center",
    },
    animation: {
        height: 150,
        width: "100%",
    },
    title: {
        textAlign: "center",
        fontWeight: "800",
        fontSize: 16,
        color: "#111827",
        marginTop: 6,
    },
    message: {
        textAlign: "center",
        color: "#6B7280",
        marginTop: 8,
        marginBottom: 14,
        lineHeight: 19,
    },
    button: {
        alignSelf: "stretch",
    },
});

export default ErrorSection;

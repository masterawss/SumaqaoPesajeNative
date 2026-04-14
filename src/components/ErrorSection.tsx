import LottieView from "lottie-react-native";
import { View, Text, StyleSheet } from "react-native";

import AppButton from "./ui/AppButton";

const ErrorSection = ({
    message = "Ha ocurrido un error",
    onRetry = () => {},
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.card}>
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
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
    },
    card: {
        backgroundColor: "rgba(255,255,255,0.9)",
        borderRadius: 24,
        padding: 18,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(17, 24, 39, 0.08)",
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 10 },
        elevation: 2,
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

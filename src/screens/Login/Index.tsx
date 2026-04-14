import React, { useEffect } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TextInput, Button, Snackbar } from "react-native-paper";
import LinearGradient from "react-native-linear-gradient";
import LogoImg from "../../../assets/img/logo.png";
import api from "../../utils/axios";

const LoginScreen = ({ navigation }: any): JSX.Element => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [hasError, setHasError] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        setLoading(true);
        AsyncStorage.getItem("user").then((user) => {
            if (user) {
                navigation.replace("home");
                return;
            }
            setLoading(false);
        });
    }, [navigation]);

    const login = () => {
        setLoading(true);
        api.post("/login", {
            email,
            password,
        })
            .then(async (response) => {
                if (response.data.status === "error") {
                    setErrorMsg(response.data.message);
                    setHasError(true);
                    return;
                }

                await AsyncStorage.setItem("user", JSON.stringify(response.data));
                navigation.replace("home");
            })
            .catch((error) => {
                setErrorMsg(error?.response?.data?.message ?? "No se pudo iniciar sesión");
                setHasError(true);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8F7F4" />
            <LinearGradient
                colors={["#F8F7F4", "#FFFFFF", "#EEF2F7", "#F8F7F4"]}
                style={styles.background}
            >
                <View style={styles.blobTop} />
                <View style={styles.blobBottom} />

                <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                    <KeyboardAvoidingView
                        style={styles.keyboard}
                        behavior={Platform.OS === "ios" ? "padding" : undefined}
                    >
                        <View style={styles.brand}>
                            <View style={styles.logoWrap}>
                                <Image source={LogoImg} style={styles.logo} resizeMode="contain" />
                            </View>
                            <Text style={styles.kicker}>Registro de pesaje</Text>
                            <Text style={styles.title}>Accede a tu cuenta</Text>
                            <Text style={styles.subtitle}>Ingresa tus credenciales para continuar.</Text>
                        </View>

                        <View style={styles.form}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Correo</Text>
                                <TextInput
                                    mode="outlined"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    textContentType="emailAddress"
                                    dense
                                    style={styles.input}
                                    outlineStyle={styles.inputOutline}
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Contraseña</Text>
                                <TextInput
                                    mode="outlined"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    autoCapitalize="none"
                                    autoComplete="password"
                                    textContentType="password"
                                    dense
                                    style={styles.input}
                                    outlineStyle={styles.inputOutline}
                                />
                            </View>

                            <Button
                                loading={loading}
                                disabled={loading}
                                mode="contained"
                                onPress={login}
                                contentStyle={styles.buttonContent}
                                style={styles.button}
                                labelStyle={styles.buttonLabel}
                            >
                                Ingresar
                            </Button>
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Soporte técnico: +51 926 596 554 · masterawss@gmail.com
                    </Text>
                </View>
            </LinearGradient>

            <Snackbar
                visible={hasError}
                onDismiss={() => {
                    setErrorMsg("");
                    setHasError(false);
                }}
                duration={3000}
            >
                {errorMsg}
            </Snackbar>
        </View>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F8F7F4",
    },
    background: {
        flex: 1,
    },
    blobTop: {
        position: "absolute",
        top: -100,
        right: -70,
        width: 220,
        height: 220,
        borderRadius: 220,
        backgroundColor: "rgba(17, 24, 39, 0.08)",
    },
    blobBottom: {
        position: "absolute",
        bottom: 90,
        left: -90,
        width: 260,
        height: 260,
        borderRadius: 260,
        backgroundColor: "rgba(96, 165, 250, 0.10)",
    },
    content: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 112,
    },
    keyboard: {
        flex: 1,
        justifyContent: "center",
    },
    brand: {
        alignItems: "center",
        marginBottom: 28,
    },
    logoWrap: {
        width: 104,
        height: 104,
        borderRadius: 30,
        backgroundColor: "rgba(255, 255, 255, 0.78)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.85)",
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 12 },
        elevation: 6,
    },
    logo: {
        width: 64,
        height: 64,
    },
    kicker: {
        color: "#6B7280",
        fontSize: 12,
        letterSpacing: 1.2,
        textTransform: "uppercase",
        marginBottom: 6,
    },
    title: {
        color: "#111827",
        fontSize: 30,
        lineHeight: 36,
        fontWeight: "800",
        textAlign: "center",
    },
    subtitle: {
        color: "#6B7280",
        fontSize: 15,
        lineHeight: 22,
        textAlign: "center",
        marginTop: 8,
        maxWidth: 280,
    },
    form: {
        paddingTop: 10,
    },
    inputGroup: {
        marginBottom: 14,
    },
    label: {
        color: "#374151",
        fontSize: 13,
        fontWeight: "600",
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: "rgba(255, 255, 255, 0.88)",
        borderRadius: 16,
    },
    inputOutline: {
        borderRadius: 16,
        borderColor: "rgba(17, 24, 39, 0.10)",
    },
    button: {
        marginTop: 10,
        borderRadius: 16,
        backgroundColor: "#111827",
        shadowColor: "#111827",
        shadowOpacity: 0.22,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 10 },
        elevation: 4,
    },
    buttonContent: {
        height: 54,
    },
    buttonLabel: {
        fontSize: 15,
        fontWeight: "700",
        letterSpacing: 0.3,
    },
    footer: {
        position: "absolute",
        left: 24,
        right: 24,
        bottom: 20,
        alignItems: "center",
    },
    footerText: {
        color: "#9CA3AF",
        fontSize: 12,
        lineHeight: 18,
        textAlign: "center",
    },
});

export default LoginScreen;

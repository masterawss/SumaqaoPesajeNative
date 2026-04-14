import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type AppRadioProps = {
    label: string;
    checked: boolean;
    onPress: () => void;
};

const AppRadio = ({ label, checked, onPress }: AppRadioProps) => {
    return (
        <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
            <View style={[styles.outer, checked && styles.outerChecked]}>
                {checked ? <View style={styles.inner} /> : null}
            </View>
            <Text style={styles.label}>{label}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
    },
    pressed: {
        opacity: 0.85,
    },
    outer: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: "#9CA3AF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },
    outerChecked: {
        borderColor: "#111827",
    },
    inner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#111827",
    },
    label: {
        color: "#111827",
        fontSize: 15,
    },
});

export default AppRadio;

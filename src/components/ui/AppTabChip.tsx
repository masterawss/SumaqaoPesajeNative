import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-paper";

type AppTabChipProps = {
    label: string;
    icon: string;
    active?: boolean;
    onPress?: () => void;
};

const AppTabChip = ({ label, icon, active = false, onPress }: AppTabChipProps) => {
    return (
        <Pressable onPress={onPress} style={({ pressed }) => [styles.chip, active && styles.active, pressed && styles.pressed]}>
            <View style={styles.row}>
                <Icon
                    source={icon}
                    size={16}
                    color={active ? "#0F172A" : "#6B7280"}
                />
                <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    chip: {
        flex: 1,
        minHeight: 44,
        borderRadius: 12,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "rgba(17, 24, 39, 0.06)",
        justifyContent: "center",
        paddingHorizontal: 12,
    },
    active: {
        backgroundColor: "#F9FAFB",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2,
        transform: [{ scale: 1.02 }],
    },
    pressed: {
        opacity: 0.85,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    label: {
        color: "#6B7280",
        fontSize: 13.5,
        fontWeight: "700",
    },
    labelActive: {
        color: "#111827",
        fontWeight: "800",
    },
});

export default AppTabChip;

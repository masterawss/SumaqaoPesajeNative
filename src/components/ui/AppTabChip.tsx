import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

type AppTabChipProps = {
    label: string;
    icon?: string;
    active?: boolean;
    onPress?: () => void;
};

const AppTabChip = ({ label, icon, active = false, onPress }: AppTabChipProps) => {
    return (
        <Pressable onPress={onPress} style={({ pressed }) => [styles.chip, active && styles.active, pressed && styles.pressed]}>
            <View style={styles.row}>
                {icon ? (
                    <MaterialCommunityIcons
                        name={icon}
                        size={16}
                        color={active ? "#FFFFFF" : "#6B7280"}
                    />
                ) : null}
                <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    chip: {
        flex: 1,
        minHeight: 44,
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        justifyContent: "center",
        paddingHorizontal: 12,
    },
    active: {
        backgroundColor: "#111827",
        borderColor: "#111827",
    },
    pressed: {
        opacity: 0.9,
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
        color: "#FFFFFF",
    },
});

export default AppTabChip;

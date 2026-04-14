import React from "react";
import { ActivityIndicator, Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

type AppIconButtonProps = Omit<PressableProps, "style"> & {
    icon: string;
    size?: number;
    color?: string;
    loading?: boolean;
    style?: StyleProp<ViewStyle>;
    variant?: "ghost" | "soft";
};

const AppIconButton = ({
    icon,
    size = 20,
    color = "#111827",
    loading = false,
    style,
    variant = "ghost",
    disabled,
    ...props
}: AppIconButtonProps) => {
    const isDisabled = disabled || loading;

    return (
        <Pressable
            disabled={isDisabled}
            hitSlop={8}
            style={({ pressed }) => [
                styles.button,
                variant === "soft" && styles.buttonSoft,
                isDisabled && styles.disabled,
                pressed && !isDisabled && styles.pressed,
                style,
            ]}
            {...props}
        >
            {loading ? (
                <ActivityIndicator size="small" color={color} />
            ) : (
                <MaterialCommunityIcons name={icon} size={size} color={color} />
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonSoft: {
        backgroundColor: "#F3F4F6",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    pressed: {
        opacity: 0.82,
    },
    disabled: {
        opacity: 0.58,
    },
});

export default AppIconButton;

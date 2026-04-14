import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { Button, ButtonProps } from "react-native-paper";

type AppButtonVariant = "primary" | "secondary" | "ghost";

type AppButtonProps = ButtonProps & {
    variant?: AppButtonVariant;
    compact?: boolean;
    contentStyle?: ViewStyle;
};

const AppButton = ({
    variant = "primary",
    compact = false,
    style,
    contentStyle,
    labelStyle,
    mode,
    ...props
}: AppButtonProps) => {
    const resolvedMode = mode ?? (variant === "ghost" ? "text" : variant === "secondary" ? "contained-tonal" : "contained");

    return (
        <Button
            mode={resolvedMode}
            buttonColor={variant === "primary" ? "#111827" : undefined}
            textColor={variant === "primary" ? "#FFFFFF" : "#111827"}
            style={[styles.button, compact && styles.compact, style]}
            contentStyle={[styles.content, compact && styles.contentCompact, contentStyle]}
            labelStyle={[styles.label, labelStyle]}
            {...props}
        />
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 12,
    },
    compact: {
        minWidth: 0,
    },
    content: {
        height: 46,
    },
    contentCompact: {
        height: 40,
    },
    label: {
        fontSize: 14,
        fontWeight: "700",
        letterSpacing: 0.2,
    },
});

export default AppButton;

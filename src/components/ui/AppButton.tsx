import React from "react";
import {
    ActivityIndicator,
    GestureResponderEvent,
    Pressable,
    PressableProps,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

type AppButtonVariant = "primary" | "secondary" | "ghost";

type AppButtonProps = Omit<PressableProps, "style"> & {
    children?: React.ReactNode;
    variant?: AppButtonVariant;
    compact?: boolean;
    contentStyle?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
    style?: StyleProp<ViewStyle>;
    loading?: boolean;
    disabled?: boolean;
    icon?: string;
    onPress?: ((event: GestureResponderEvent) => void) | undefined;
};

const VARIANT_STYLES: Record<AppButtonVariant, { button: ViewStyle; label: TextStyle; spinner: string }> = {
    primary: {
        button: {
            backgroundColor: "#111827",
            borderColor: "#111827",
        },
        label: {
            color: "#FFFFFF",
        },
        spinner: "#FFFFFF",
    },
    secondary: {
        button: {
            backgroundColor: "#F3F4F6",
            borderColor: "#E5E7EB",
        },
        label: {
            color: "#111827",
        },
        spinner: "#111827",
    },
    ghost: {
        button: {
            backgroundColor: "transparent",
            borderColor: "transparent",
        },
        label: {
            color: "#111827",
        },
        spinner: "#111827",
    },
};

const AppButton = ({
    children,
    variant = "primary",
    compact = false,
    contentStyle,
    labelStyle,
    style,
    loading = false,
    disabled = false,
    icon,
    onPress,
    ...props
}: AppButtonProps) => {
    const isDisabled = disabled || loading;
    const variantStyles = VARIANT_STYLES[variant];

    const renderLabel = () => {
        if (typeof children === "string" || typeof children === "number") {
            return (
                <Text
                    numberOfLines={1}
                    style={[styles.label, compact && styles.labelCompact, variantStyles.label, labelStyle]}
                >
                    {children}
                </Text>
            );
        }

        if (children == null) {
            return null;
        }

        return children;
    };

    return (
        <Pressable
            accessibilityRole="button"
            disabled={isDisabled}
            onPress={onPress}
            style={({ pressed }) => [
                styles.button,
                compact && styles.buttonCompact,
                variantStyles.button,
                isDisabled && styles.buttonDisabled,
                pressed && !isDisabled && styles.buttonPressed,
                style,
            ]}
            {...props}
        >
            <View style={[styles.content, compact && styles.contentCompact, contentStyle]}>
                {loading ? (
                    <ActivityIndicator
                        color={variantStyles.spinner}
                        size="small"
                        style={children ? styles.leading : undefined}
                    />
                ) : icon ? (
                    <MaterialCommunityIcons
                        name={icon}
                        size={18}
                        color={variantStyles.label.color}
                        style={children ? styles.leading : undefined}
                    />
                ) : null}
                {renderLabel()}
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        minHeight: 46,
        borderRadius: 14,
        borderWidth: 1,
        overflow: "hidden",
    },
    buttonCompact: {
        minHeight: 40,
    },
    buttonPressed: {
        opacity: 0.88,
    },
    buttonDisabled: {
        opacity: 0.62,
    },
    content: {
        minHeight: 46,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    contentCompact: {
        minHeight: 40,
        paddingHorizontal: 14,
    },
    leading: {
        marginRight: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: "700",
        letterSpacing: 0.2,
    },
    labelCompact: {
        fontSize: 13.5,
    },
});

export default AppButton;

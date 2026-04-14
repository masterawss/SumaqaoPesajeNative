import React from "react";
import {
    StyleProp,
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TextStyle,
    View,
    ViewStyle,
} from "react-native";

type AppInputProps = TextInputProps & {
    label?: string;
    containerStyle?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
    outlineStyle?: StyleProp<ViewStyle>;
};

const AppInput = ({
    label,
    style,
    containerStyle,
    inputStyle,
    outlineStyle,
    onFocus,
    onBlur,
    ...props
}: AppInputProps) => {
    const [focused, setFocused] = React.useState(false);

    const handleFocus = (event: any) => {
        setFocused(true);
        onFocus?.(event);
    };

    const handleBlur = (event: any) => {
        setFocused(false);
        onBlur?.(event);
    };

    return (
        <View style={containerStyle}>
            {label ? <Text style={styles.label}>{label}</Text> : null}
            <View style={[styles.field, focused && styles.fieldFocused, outlineStyle, style]}>
                <TextInput
                    placeholderTextColor="#9CA3AF"
                    style={[styles.input, inputStyle]}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    {...props}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    label: {
        color: "#374151",
        fontSize: 13,
        fontWeight: "600",
        marginBottom: 8,
        marginLeft: 2,
    },
    field: {
        minHeight: 50,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#D1D5DB",
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        paddingHorizontal: 14,
    },
    fieldFocused: {
        borderColor: "#111827",
    },
    input: {
        color: "#111827",
        fontSize: 15,
        paddingVertical: 12,
    },
});

export default AppInput;

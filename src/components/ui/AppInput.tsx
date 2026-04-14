import React from "react";
import { StyleSheet } from "react-native";
import { TextInput, TextInputProps } from "react-native-paper";

type AppInputProps = TextInputProps & {
    label?: string;
};

const AppInput = ({ style, outlineStyle, ...props }: AppInputProps) => {
    return (
        <TextInput
            mode="outlined"
            dense
            style={[styles.input, style]}
            outlineStyle={[styles.outline, outlineStyle]}
            {...props}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        backgroundColor: "rgba(255, 255, 255, 0.92)",
    },
    outline: {
        borderRadius: 16,
        borderColor: "rgba(17, 24, 39, 0.10)",
    },
});

export default AppInput;

import React from "react";
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from "react-native";

type AppSurfaceProps = ViewProps & {
    style?: StyleProp<ViewStyle>;
};

const AppSurface = ({ style, ...props }: AppSurfaceProps) => {
    return <View style={[styles.surface, style]} {...props} />;
};

const styles = StyleSheet.create({
    surface: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
});

export default AppSurface;

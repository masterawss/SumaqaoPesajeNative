import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

const AppDivider = ({ style }: { style?: StyleProp<ViewStyle> }) => {
    return <View style={[styles.divider, style]} />;
};

const styles = StyleSheet.create({
    divider: {
        height: 1,
        backgroundColor: "#E5E7EB",
        width: "100%",
    },
});

export default AppDivider;

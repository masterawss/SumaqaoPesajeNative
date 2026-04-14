import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";

type AppCardProps = {
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    style?: ViewStyle;
    headerRight?: React.ReactNode;
};

const AppCard = ({ title, subtitle, children, style, headerRight }: AppCardProps) => {
    return (
        <View style={[styles.card, style]}>
            {(title || subtitle || headerRight) && (
                <View style={styles.header}>
                    <View style={styles.headerText}>
                        {title ? <Text style={styles.title}>{title}</Text> : null}
                        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
                    </View>
                    {headerRight}
                </View>
            )}
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "rgba(255,255,255,0.92)",
        borderRadius: 24,
        padding: 18,
        borderWidth: 1,
        borderColor: "rgba(17, 24, 39, 0.08)",
        shadowColor: "#000",
        shadowOpacity: 0.07,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 3,
    },
    header: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: 14,
        gap: 12,
    },
    headerText: {
        flex: 1,
    },
    title: {
        color: "#111827",
        fontSize: 18,
        fontWeight: "800",
    },
    subtitle: {
        color: "#6B7280",
        fontSize: 13,
        lineHeight: 18,
        marginTop: 4,
    },
});

export default AppCard;

import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { Portal, Provider as PaperProvider, Snackbar as PaperSnackbar, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppSnackbarOptions, Snackbar, subscribeToSnackbar } from "../../utils/snackbar";

const resolveActionTextColor = (color?: string) => {
    switch (color) {
        case "green":
            return "#86EFAC";
        case "red":
            return "#FCA5A5";
        default:
            return color ?? "#D1D5DB";
    }
};

const AppSnackbarProvider = ({ children }: { children: ReactNode }) => {
    const [snackbar, setSnackbar] = useState<AppSnackbarOptions | null>(null);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        return subscribeToSnackbar(setSnackbar);
    }, []);

    const handleDismiss = () => {
        setSnackbar(null);
    };

    const action = useMemo(() => {
        if (!snackbar?.action?.text) {
            return undefined;
        }

        return {
            label: snackbar.action.text,
            onPress: () => {
                snackbar.action?.onPress?.();
                handleDismiss();
            },
            textColor: resolveActionTextColor(snackbar.action.textColor),
        };
    }, [snackbar]);

    return (
        <PaperProvider>
            {children}
            <Portal>
                <PaperSnackbar
                    visible={!!snackbar}
                    onDismiss={handleDismiss}
                    duration={snackbar?.duration ?? Snackbar.LENGTH_SHORT}
                    action={action}
                    elevation={3}
                    wrapperStyle={[
                        styles.wrapper,
                        { bottom: insets.bottom + 10 + (snackbar?.marginBottom ?? 0) },
                    ]}
                    style={[
                        styles.snackbar,
                        snackbar?.backgroundColor ? { backgroundColor: snackbar.backgroundColor } : null,
                    ]}
                >
                    {snackbar ? (
                        <Text
                            numberOfLines={snackbar.numberOfLines ?? 2}
                            style={[styles.text, snackbar.textColor ? { color: snackbar.textColor } : null]}
                        >
                            {snackbar.text}
                        </Text>
                    ) : null}
                </PaperSnackbar>
            </Portal>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 16,
        alignItems: "center",
    },
    snackbar: {
        width: "100%",
        maxWidth: 720,
        borderRadius: 18,
        backgroundColor: "#111827",
        shadowColor: "#000000",
        shadowOpacity: 0.16,
        shadowRadius: 18,
        shadowOffset: {
            width: 0,
            height: 8,
        },
    },
    text: {
        color: "#F9FAFB",
        fontSize: 15,
        lineHeight: 20,
        fontWeight: "600",
    },
});

export default AppSnackbarProvider;

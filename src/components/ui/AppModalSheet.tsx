import React from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleProp,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
    ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppIconButton from "./AppIconButton";

type AppModalSheetProps = {
    visible: boolean;
    onClose: () => void;
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    contentContainerStyle?: StyleProp<ViewStyle>;
    scrollable?: boolean;
};

const AppModalSheet = ({
    visible,
    onClose,
    title,
    subtitle,
    children,
    contentContainerStyle,
    scrollable = true,
}: AppModalSheetProps) => {
    const insets = useSafeAreaInsets();
    const { height: windowHeight } = useWindowDimensions();
    const [headerHeight, setHeaderHeight] = React.useState(0);
    const [contentHeight, setContentHeight] = React.useState(0);

    const maxSheetHeight = Math.max(240, windowHeight - insets.top - insets.bottom - 24);
    const chromeHeight = headerHeight || 84;
    const maxBodyHeight = Math.max(120, maxSheetHeight - chromeHeight - 24);
    const shouldScroll = scrollable && contentHeight > maxBodyHeight;

    const content = (
        <View
            style={[
                styles.sheet,
                { maxHeight: maxSheetHeight, paddingBottom: 16 + insets.bottom },
                contentContainerStyle,
            ]}
        >
            <View style={styles.handle} />
            {(title || subtitle) && (
                <View style={styles.header} onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}>
                    <View style={styles.headerText}>
                        {title ? <Text style={styles.title}>{title}</Text> : null}
                        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
                    </View>
                    <AppIconButton icon="close" variant="soft" onPress={onClose} />
                </View>
            )}

            {scrollable ? (
                shouldScroll ? (
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                        style={[styles.bodyScroll, { maxHeight: maxBodyHeight }]}
                        contentContainerStyle={styles.bodyScrollContent}
                    >
                        <View onLayout={(event) => setContentHeight(event.nativeEvent.layout.height)}>
                            {children}
                        </View>
                    </ScrollView>
                ) : (
                    <View onLayout={(event) => setContentHeight(event.nativeEvent.layout.height)}>
                        {children}
                    </View>
                )
            ) : (
                children
            )}
        </View>
    );

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.backdrop} onPress={onClose}>
                <Pressable onPress={(event) => event.stopPropagation()} style={styles.container}>
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboard}>
                        {content}
                    </KeyboardAvoidingView>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(15, 23, 42, 0.42)",
        justifyContent: "flex-end",
    },
    container: {
        justifyContent: "flex-end",
    },
    keyboard: {
        justifyContent: "flex-end",
    },
    sheet: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 16,
        paddingTop: 10,
        width: "100%",
        alignSelf: "stretch",
    },
    handle: {
        alignSelf: "center",
        width: 42,
        height: 4,
        borderRadius: 999,
        backgroundColor: "#CBD5E1",
        marginBottom: 14,
    },
    header: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 16,
        minHeight: 40,
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
    bodyScroll: {
        width: "100%",
    },
    bodyScrollContent: {
        paddingBottom: 2,
    },
});

export default AppModalSheet;

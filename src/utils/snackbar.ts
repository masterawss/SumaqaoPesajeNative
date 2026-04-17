import { Snackbar as PaperSnackbar } from "react-native-paper";

export interface AppSnackbarAction {
    text: string;
    textColor?: string;
    onPress?: () => void;
}

export interface AppSnackbarOptions {
    text: string;
    duration?: number;
    action?: AppSnackbarAction;
    textColor?: string;
    backgroundColor?: string;
    numberOfLines?: number;
    marginBottom?: number;
}

type SnackbarListener = (options: AppSnackbarOptions | null) => void;

const listeners = new Set<SnackbarListener>();

export const subscribeToSnackbar = (listener: SnackbarListener) => {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
};

const emitSnackbar = (options: AppSnackbarOptions | null) => {
    listeners.forEach((listener) => listener(options));
};

export const Snackbar = {
    LENGTH_SHORT: PaperSnackbar.DURATION_SHORT,
    LENGTH_LONG: PaperSnackbar.DURATION_LONG,
    LENGTH_INDEFINITE: Number.POSITIVE_INFINITY,
    show: (options: AppSnackbarOptions) => {
        emitSnackbar(options);
    },
    dismiss: () => {
        emitSnackbar(null);
    },
};

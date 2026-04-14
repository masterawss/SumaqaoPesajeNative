import AsyncStorage from "@react-native-async-storage/async-storage";

export type BalanzaItem = {
    title: string;
    address: string;
};

const BALANZAS_STORAGE_KEY = "balanzas";
const BALANZA_ACTIVA_STORAGE_KEY = "balanza_activa_address";

const normalizeAddress = (address: string) => address.trim().toUpperCase();

export const normalizeBalanza = (balanza: BalanzaItem): BalanzaItem => ({
    title: balanza.title.trim(),
    address: normalizeAddress(balanza.address),
});

const parseBalanzas = (value: string | null): BalanzaItem[] => {
    if (!value) {
        return [];
    }

    try {
        const parsed = JSON.parse(value);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed
            .filter((item) => item?.title && item?.address)
            .map((item) =>
                normalizeBalanza({
                    title: item.title,
                    address: item.address,
                }),
            );
    } catch (error) {
        return [];
    }
};

export const getStoredBalanzas = async () => {
    const value = await AsyncStorage.getItem(BALANZAS_STORAGE_KEY);
    return parseBalanzas(value);
};

export const saveStoredBalanzas = async (balanzas: BalanzaItem[]) => {
    const normalized = balanzas.map(normalizeBalanza);
    await AsyncStorage.setItem(BALANZAS_STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
};

export const getStoredActiveBalanzaAddress = async () => {
    const value = await AsyncStorage.getItem(BALANZA_ACTIVA_STORAGE_KEY);
    return value ? normalizeAddress(value) : null;
};

export const saveStoredActiveBalanzaAddress = async (address: string | null) => {
    if (!address) {
        await AsyncStorage.removeItem(BALANZA_ACTIVA_STORAGE_KEY);
        return null;
    }

    const normalizedAddress = normalizeAddress(address);
    await AsyncStorage.setItem(BALANZA_ACTIVA_STORAGE_KEY, normalizedAddress);
    return normalizedAddress;
};

export const getStoredActiveBalanza = async () => {
    const [balanzas, activeAddress] = await Promise.all([
        getStoredBalanzas(),
        getStoredActiveBalanzaAddress(),
    ]);

    if (!activeAddress) {
        return null;
    }

    return balanzas.find((balanza) => balanza.address === activeAddress) ?? null;
};

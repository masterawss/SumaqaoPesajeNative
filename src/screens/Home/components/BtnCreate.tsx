import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import api from "../../../utils/axios";
import AppButton from "../../../components/ui/AppButton";
const Snackbar = require("react-native-snackbar");

const BtnCreate = ({ type = "ingreso" }) => {
    const navigation = useNavigation<any>();
    const [loading, setLoading] = React.useState(false);

    const create = async () => {
        setLoading(true);
        const user = await AsyncStorage.getItem("user");

        api.post("/ticket_pesaje/store", {
            type,
            created_user_id: JSON.parse(user || "")?.id,
        })
            .then((response) => {
                navigation.navigate("ticket_pesaje.show" as never, { id: response.data.id } as never);
            })
            .catch(() => {
                Snackbar.show({
                    text: "No se pudo crear el registro",
                    duration: Snackbar.LENGTH_INDEFINITE,
                    action: {
                        text: "Cerrar",
                        textColor: "red",
                        onPress: () => {},
                    },
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <AppButton
            compact
            icon="plus"
            loading={loading}
            disabled={loading}
            onPress={create}
        >
            Nuevo
        </AppButton>
    );
};

export default BtnCreate;

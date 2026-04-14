import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import SimpleCard from './Saco/SimpleCard';

const Saco = () => {
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>Sacos recibidos</Text>
                <Text style={styles.subtitle}>Configura las dos columnas de sacos</Text>
            </View>
            <SimpleCard col={1} nroItem={1} />
            <SimpleCard col={2} nroItem={2} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 8,
    },
    title: {
        color: "#111827",
        fontSize: 15,
        fontWeight: "800",
    },
    subtitle: {
        color: "#6B7280",
        fontSize: 11,
        marginTop: 0,
    },
});

export default Saco;

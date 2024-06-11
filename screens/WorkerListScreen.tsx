//Pantalla para mostrar la lista de trabajadores.
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../constants/colors';

const workers = [
    { id: '1', name: 'Juan Pérez', position: 'Desarrollador' },
    { id: '2', name: 'Ana García', position: 'Diseñadora' },
    { id: '3', name: 'Carlos López', position: 'Gerente de Proyecto' },
    // Agrega más trabajadores según sea necesario
];

const WorkerListScreen = ({ navigation }) => {
    const renderWorker = ({ item }) => (
        <TouchableOpacity
            style={styles.workerItem}
            onPress={() => navigation.navigate('WorkerDetail', { workerId: item.id })}
        >
            <Text style={styles.workerName}>{item.name}</Text>
            <Text style={styles.workerPosition}>{item.position}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={workers}
                renderItem={renderWorker}
                keyExtractor={(item) => item.id}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    workerItem: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    workerName: {
        fontSize: 18,
        color: COLORS.black,
    },
    workerPosition: {
        fontSize: 14,
        color: COLORS.gray,
    },
});

export default WorkerListScreen;
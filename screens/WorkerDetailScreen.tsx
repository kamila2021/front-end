//Pantalla para mostrar el resumen semanal del trabajador seleccionado.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../constants/colors';
import WeeklySummary from './screens/WeeklySummary';

const WorkerDetailScreen = ({ route }) => {
    const { workerId } = route.params;

    // Aquí podrías hacer una llamada para obtener la información del trabajador por su ID
    // const worker = fetchWorkerById(workerId);

    {/*return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Resumen Semanal del Trabajador</Text>
             Renderiza el resumen semanal del trabajador 
            <WeeklySummary workerId={workerId} />
        </SafeAreaView>
    );
*/};
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.black,
        marginBottom: 20,
    },
});

export default WorkerDetailScreen;
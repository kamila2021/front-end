// Importa los componentes necesarios y las funciones de utilidad
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../constants/colors';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../components/Button';
import { formatDate } from '../components/dateHelpers';

const Resumen = ({ navigation, workerId }: { navigation: any, workerId?: any }) => {
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [weekEntries, setWeekEntries] = useState<any[]>([]);

    // Función para obtener las entradas de la semana
    useEffect(() => {
        const formattedCurrentWeek = currentWeek.toISOString().split('T')[0];
        fetchWeeklyEntries(formattedCurrentWeek);
    }, [currentWeek]);

    const fetchWeeklyEntries = async (inputDate: string) => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                throw new Error('No se encontró el token.');
            }

            const response = await axios.post(`http://192.168.0.17:4000/schedule/fecha`, {
                inputDate: inputDate
            }, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });
            
            const data = response.data;
            setWeekEntries(data);
        } catch (error) {
            if (error.response) {
                // Error en la respuesta del servidor (backend)
                console.error('Error en la respuesta del servidor:', error.response.data);
            } else if (error.request) {
                // Error en la solicitud (frontend)
                console.error('Error en la solicitud:', error.request);
            } else {
                // Otros tipos de errores
                console.error('Error:', error.message);
            }
        }
    };

    const handlePreviousWeek = () => {
        const previousWeek = new Date(currentWeek);
        previousWeek.setDate(currentWeek.getDate() - 7);
        setCurrentWeek(previousWeek);
    };

    const handleNextWeek = () => {
        const nextWeek = new Date(currentWeek);
        nextWeek.setDate(currentWeek.getDate() + 7);
        setCurrentWeek(nextWeek);
    };

    // Función para renderizar cada entrada de la semana
    const renderEntry = ({ item }: { item: any }) => (
        <View style={styles.entryContainer}>
            <Text style={styles.entryDate}>{formatDate(item.date)}</Text>
            <Text style={styles.entryTime}>Hora de entrada: {item.entryTime}</Text>
            <Text style={styles.exitTime}>Hora de salida: {item.exitTime}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Resumen Semanal</Text>
            <View style={styles.buttonContainer}>
                <Button title="Semana Anterior" onPress={handlePreviousWeek} filled />
                <Button title="Semana Siguiente" onPress={handleNextWeek} filled />
            </View>
            {weekEntries.length > 0 ? (
                <FlatList
                    data={weekEntries}
                    renderItem={renderEntry}
                    keyExtractor={(item, index) => index.toString()}
                />
            ) : (
                <Text style={styles.emptyMessage}>No hay registros para esta semana</Text>
            )}
            <TouchableOpacity
                onPress={() => navigation.navigate('Home')}
                style={styles.backButton}
            >
                <Text style={styles.backButtonText}>Volver al inicio</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 10,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    entryContainer: {
        marginBottom: 15,
        padding: 10,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        borderRadius: 8,
    },
    entryDate: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    entryTime: {
        fontSize: 16,
        marginBottom: 3,
    },
    exitTime: {
        fontSize: 16,
        marginBottom: 3,
    },
    emptyMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    backButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 20,
    },
    backButtonText: {
        fontSize: 16,
        color: COLORS.white,
    },
});

export default Resumen;

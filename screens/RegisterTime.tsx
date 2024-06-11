import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../constants/colors';
import useStore from './useStore';


const RegisterTime = ({ navigation }: { navigation: any }) => {
    const [entryTime, setEntryTime] = useState('');
    const [exitTime, setExitTime] = useState('');
    const [error, setError] = useState('');

    const getCurrentTime = () => {
        const currentDate = new Date();
        const currentHour = currentDate.getHours();
        const currentMinute = currentDate.getMinutes();
        const currentSecond = currentDate.getSeconds();
        return `${currentHour}:${currentMinute}:${currentSecond}`;
    };

    const handleTime = async (type: 'Ingreso' | 'Salida') => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                throw new Error('No se encontró el token.');
            }
    
            // Obtener la hora actual si no hay una hora registrada
            const currentTime = new Date().toISOString().split('T')[0];
    
            // Realizar la solicitud para registrar la entrada/salida
            const url = type === 'Ingreso' ? 'http://192.168.0.17:4000/schedule/entry' : 'http://192.168.0.17:4000/schedule/departure';
            const body = type === 'Ingreso' ? { date: currentTime, entered: entryTime || getCurrentTime() } : { date: currentTime, left: exitTime || getCurrentTime()}; // Asegúrate de que user.id contenga el ID del usuario
    
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(body)
            });
    
            if (response.status === 201) {
                Alert.alert(
                    type === 'Ingreso' ? 'Hora de entrada registrada' : 'Hora de salida registrada',
                    `Tu hora de ${type.toLowerCase()} es: ${getCurrentTime()}`
                );
            } else {
                const errorMessage = await response.json();
                throw new Error(errorMessage.message || 'Error desconocido al registrar la hora');
            }
        } catch (error) {
            console.error('Error al registrar hora:', error.message);
            Alert.alert('Error', error.message || 'Ocurrió un error al conectar con el servidor. Por favor, revisa tu conexión e intenta de nuevo.');
        }
    };
    
    

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Registra tu hora!</Text>

            <View style={{ marginVertical: 20 }}>
                <TouchableOpacity
                    onPress={() => handleTime('Ingreso')}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Ingreso</Text>
                </TouchableOpacity>
            </View>
            <View style={{ marginVertical: 10 }}>
                <TouchableOpacity
                    onPress={() => handleTime('Salida')}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Salida</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                onPress={() => navigation.navigate('Home')}
                style={styles.backButton}
            >
                <Text style={{ fontSize: 20, color: COLORS.primary }}>Volver al perfil</Text>
            </TouchableOpacity>

            {error !== '' && <Text style={styles.errorText}>{error}</Text>}
           
            {exitTime !== '' && (
                <View style={styles.timeContainer}>
                    <Text>Última salida:</Text>
                    <Text>{exitTime}</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        height: 50,
        width: '80%',
        borderRadius: 8,
        marginVertical: 10,
    },
    backButton: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        height: 70,
        width: '80%',
        borderRadius: 8,
        backgroundColor: COLORS.lightGray,
    },
    buttonText: {
        fontSize: 20,
        color: '#fff',
    },
    timeContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});

export default RegisterTime;

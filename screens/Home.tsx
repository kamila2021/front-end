import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../constants/colors';

interface User {
    firstName: string;
    lastName: string;
    email: string;
    birthday: string;
    isAdmin: string;
}

const Home = ({ navigation }: { navigation: any }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchProfile = async () => {
        const token = await AsyncStorage.getItem('token');
        console.log('Token:', token); // Log para verificar el token
        if (!token) {
            setError('No token found');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get('http://192.168.0.17:3000/auth/profile', {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
            setUser(response.data);
        } catch (err) {
            console.error('Failed to fetch user profile:', err);
            setError('Failed to fetch user profile');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleLogout = async () => {
        try {
            // Eliminar el token de AsyncStorage
            await AsyncStorage.removeItem('token');
            // Navegar de vuelta a la pantalla de Login
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            // Manejar cualquier error que ocurra durante el proceso de cierre de sesión
        }
    };

    const getRoleName = (isAdmin: string) => {
        if (isAdmin == '1') {
            return 'Administrador';
        } else if (isAdmin == '0') {
            return 'Trabajador';
        }
    };

    const handleReload = () => {
        setLoading(true);
        fetchProfile();
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <View style={styles.container}><Text>{error}</Text></View>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 20, marginTop: 20 }}>
                <TouchableOpacity onPress={handleReload}>
                    <Text style={{ fontSize: 16, color: COLORS.primary }}>Recargar</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 3, marginHorizontal: 120, justifyContent: 'center' }}>
            <Text style={{ fontSize:35, fontWeight: 'bold', marginVertical: 20, color: COLORS.black }}>
                        Mi perfil!
                    </Text>
                    <TouchableOpacity
    onPress={() => navigation.navigate('ProfileEdit', { user: user })}
    style={{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 10,
    }}
>
    <Text style={{ fontSize: 16, color: COLORS.white }}>Editar Datos</Text>
</TouchableOpacity>
                    </View>
            {user && (
                <View style={styles.profileContainer}>
                    <Text style={styles.label}>Nombre: {user.firstName}</Text>
                    <Text style={styles.label}>Apellido: {user.lastName}</Text>
                    <Text style={styles.label}>Email: {user.email}</Text>
                    <Text style={styles.label}>Fecha de Nacimiento: {user.birthday}</Text>
                    <Text style={styles.label}>Rol: {getRoleName(user.isAdmin)}</Text>
                    <TouchableOpacity
                    onPress={() => navigation.navigate('RegisterTime')}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: COLORS.primary,
                        paddingVertical: 12,
                        borderRadius: 5,
                        marginTop: 30,
                    }}
                >
                    <Text style={{ fontSize: 16, color: COLORS.white}}>Registrar Hora</Text>
                </TouchableOpacity>
                <TouchableOpacity
                        onPress={() => navigation.navigate('Resumen')}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: COLORS.lightGray,
                            paddingVertical: 12,
                            borderRadius: 8,
                            marginTop: 30,
                        }}
                    >
                         <Text style={{ fontSize: 16, color: COLORS.primary }}>Resumen</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={handleLogout}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: COLORS.lightGray,
                        paddingVertical: 12,
                        borderRadius: 8,
                        marginTop: 10,
                    }}
                >
                    <Text style={{ fontSize: 16, color: COLORS.primary }}>Cerrar Sesion</Text>
                </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginVertical: 10,
        color: COLORS.black,
        textAlign: 'center',
    },
    profileContainer: {
        width: '100%',
        alignItems: 'center',
    },
    label: {
        fontSize: 18,
        marginBottom: 45,
        textAlign: 'center',
    },
});

export default Home;

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }: { navigation: any }) => {
    const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    const validateEmail = (text: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(text);
    };

    const handleLogin = async () => {
        if (email === '' || password === '') {
            Alert.alert('Error', 'Por favor, complete todos los campos');
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert('Error', 'Por favor, ingrese un correo electrónico válido');
            return;
        }

        setLoading(true);

        try {
            const loginFetch = await fetch('http://192.168.0.17:3000/auth/login', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                })
            });

            if (loginFetch.status === 201 || loginFetch.status === 200) {
                const data = await loginFetch.json();

                if (data.token && data.token.token) {
                    const token = data.token.token;
                    await AsyncStorage.setItem('token', token);

                    // Verificar si el usuario es administrador
                    const isAdminResponse = await fetch('http://192.168.0.17:3000/auth/isAdmin', {
                        method: 'POST',
                        headers: {
                            Authorization: 'Bearer ' + token
                        }
                    });

                    const isAdminData = await isAdminResponse.json();

                    if (isAdminData.isAdmin) {
                        navigation.navigate('MenuAdmin');
                    } else {
                        navigation.navigate('Home');
                    }
                } else {
                    setMessage('Token no recibido del servidor');
                }
            } else if (loginFetch.status === 500) {
                Alert.alert('Usuario no registrado');
            } else {
                const data = await loginFetch.json();
                
                setMessage(data.message || 'Inicio de sesión fallido');
            }
        } catch (error) {
            console.error('Error al realizar el inicio de sesión:', error);
            Alert.alert('Error', 'Ocurrió un error al iniciar sesión. Por favor, intenta de nuevo más tarde');
        } finally {
            setLoading(false);
        }
    };
     

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
             <View style={{ flex: 0.2, marginHorizontal: 120, justifyContent: 'center' }}>
            <Text style={{ fontSize: 35, fontWeight: 'bold', marginVertical: 20, color: COLORS.black }}>
                        MarcApp
                    </Text>
                    </View>
            <View style={{ flex: 0.6, marginHorizontal: 22, justifyContent: 'center' }}>
                <View style={{ marginVertical: 20 }}>
                    
                    <Text style={{ fontSize: 22, fontWeight: 'bold', marginVertical: 20, color: COLORS.black }}>
                        ¡Bienvenido! 👋
                    </Text>
                    <Text style={{ fontSize: 16, color: COLORS.black }}>Ingresa tu correo y contraseña para iniciar sesión</Text>
                </View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 16, fontWeight: '400', marginVertical: 8 }}>Correo</Text>
                    <TextInput
                        placeholder='Ingresa tu correo'
                        placeholderTextColor={COLORS.black}
                        keyboardType='email-address'
                        value={email}
                        onChangeText={setEmail}
                        style={{ width: '100%', height: 48, borderColor: COLORS.black, borderWidth: 1, borderRadius: 8, paddingLeft: 22 }}
                    />
                </View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 16, fontWeight: '400', marginVertical: 8 }}>Contraseña</Text>
                    <View style={{ width: '100%', height: 48, borderColor: COLORS.black, borderWidth: 1, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 22 }}>
                        <TextInput
                            placeholder='Ingresa tu contraseña'
                            placeholderTextColor={COLORS.black}
                            secureTextEntry={!isPasswordShown}
                            value={password}
                            onChangeText={setPassword}
                            style={{ width: '85%' }}
                        />
                        <TouchableOpacity
                            onPress={() => setIsPasswordShown(!isPasswordShown)}
                            style={{ padding: 10 }}
                        >
                            <Ionicons name={isPasswordShown ? "eye-off" : "eye"} size={24} color={COLORS.black} />
                        </TouchableOpacity>
                    </View>
                </View>

                <Button
                    title="Iniciar sesión"
                    filled
                    onPress={handleLogin}
                    style={{ marginTop: 18, marginBottom: 4 }}
                />

                <TouchableOpacity
                    onPress={() => navigation.navigate('ForgotPassword')}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: COLORS.white,
                        paddingVertical: 12,
                        borderRadius: 8,
                        marginTop: 20,
                    }}
                >
                    <Text style={{ fontSize: 16, color: COLORS.primary}}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate('Signup')}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: COLORS.white,
                        paddingVertical: 12,
                        borderRadius: 8,
                        marginTop: 10,
                    }}
                >
                    <Text style={{ fontSize: 16, color: COLORS.primary}}>Regístrate</Text>
                </TouchableOpacity>

                {loading && <ActivityIndicator color={COLORS.blue} />}
                {message !== '' && <Text style={{ color: COLORS.red, textAlign: 'center', marginTop: 20 }}>{message}</Text>}
            </View>
        </SafeAreaView>
    );
};

export default Login;
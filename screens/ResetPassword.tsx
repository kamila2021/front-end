import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../constants/colors';
import Button from '../components/Button';

const ResetPassword = ({ route, navigation }: { route: any, navigation: any }) => {
    const { email: initialEmail } = route.params ?? {}; // Obtiene el correo electrónico pasado como parámetro
    const [email, setEmail] = useState<string>(initialEmail ?? ''); // Usa el correo electrónico inicial si está disponible
    const [code, setCode] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleResetPassword = async () => {
        if (email === '' || code === '' || newPassword === '') {
            Alert.alert('Error', 'Por favor, complete todos los campos');
            return;
        }
        if (code.length !== 6) {
            Alert.alert('Error', 'El código debe tener 6 caracteres');
            return;
        }
        setLoading(true);
        try {
            const resetFetch = await fetch('http://192.168.0.17:3000/user/reset-password', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    resetCode: code,
                    newPassword: newPassword,
                })
            });
            if (resetFetch.ok) {
                console.log("si funciono")
                setError('');
                navigation.navigate('Login');
            } else {
                console.log(resetFetch)
                const response = await resetFetch.json();
                setError(response.error);
            }
        } catch (error) {
            console.log("no funciono nada")
            setError('Server error');
        }
        setLoading(false);
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <View style={{ flex: 1, marginHorizontal: 22, justifyContent: 'center' }}>
                <Text style={{ fontSize: 22, fontWeight: 'bold', marginVertical: 12, color: COLORS.black }}>
                    Restablecer contraseña
                </Text>
                <Text style={{ fontSize: 16, color: COLORS.black }}>
                    Ingresa tu correo, el código de restablecimiento y la nueva contraseña.
                </Text>
                <View style={{ marginTop: 20 }}>
                    <Text>Correo electrónico</Text>
                    <TextInput
                        placeholder='Ingresa tu correo electrónico'
                        placeholderTextColor={COLORS.black}
                        value={email}
                        onChangeText={setEmail}
                        editable={initialEmail === undefined} // Hace que el campo de correo electrónico sea no editable si ya se proporcionó
                        style={{ width: '100%', height: 48, borderColor: COLORS.black, borderWidth: 1, borderRadius: 8, paddingLeft: 22 }}
                    />
                </View>
                <View style={{ marginTop: 20 }}>
                    <Text>Código de restablecimiento</Text>
                    <TextInput
                        placeholder='Ingresa el código'
                        placeholderTextColor={COLORS.black}
                        value={code}
                        onChangeText={setCode}
                        style={{ width: '100%', height: 48, borderColor: COLORS.black, borderWidth: 1, borderRadius: 8, paddingLeft: 22 }}
                    />
                </View>
                <View style={{ marginTop: 20 }}>
                    <Text>Nueva Contraseña</Text>
                    <TextInput
                        placeholder='Ingresa la nueva contraseña'
                        placeholderTextColor={COLORS.black}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry
                        style={{ width: '100%', height: 48, borderColor: COLORS.black, borderWidth: 1, borderRadius: 8, paddingLeft: 22 }}
                    />
                </View>
                <Button
                    title="Restablecer contraseña"
                    onPress={handleResetPassword}
                    filled
                    style={{ marginTop: 18, marginBottom: 4 }}
                />
                {loading && <ActivityIndicator size="large" color={COLORS.primary} />}
                {error !== '' && <Text style={{ color: 'red' }}>{error}</Text>}
                <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: COLORS.lightGray,
                        paddingVertical: 12,
                        borderRadius: 8,
                        marginTop: 10,
                    }}
                >
                    <Text style={{ fontSize: 16, color: COLORS.primary }}>Volver a login</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default ResetPassword;
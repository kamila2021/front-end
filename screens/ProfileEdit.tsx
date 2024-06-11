import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../constants/colors';
import Button from '../components/Button';
import DateTimePicker from '@react-native-community/datetimepicker';
import zustand from 'zustand';


const ProfileEdit = ({ navigation, route }: { navigation: any, route: any }) => {
    const { user } = route.params;
    const [firstName, setName] = useState<string>(user.firstName);
    const [lastName, setLastName] = useState<string>(user.lastName);
    const [email, setEmail] = useState<string>(user.email);
    const [birthday, setBirthday] = useState<Date | null>(new Date(user.birthday));
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [messageColor, setMessageColor] = useState<string>('black');
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const validateName = (text: string) => {
        const regex = /^[a-zA-Z\s]*$/;
        return regex.test(text) && text.trim().length > 0;
    };

    const validateEmail = (text: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(text) && text.trim().length > 0;
    };

    const handleDateOfBirthPress = () => {
        setShowDatePicker(true);
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const newBirthday = new Date(selectedDate);
            setBirthday(newBirthday);
        }
    };

    const handleSaveProfile = async () => {
        if (!validateName(firstName) || !validateName(lastName) || !validateEmail(email) || !birthday) {
            Alert.alert('Error', 'Por favor, complete todos los campos correctamente.');
            return;
        }
    
        setLoading(true);
    console.log('paso por 1')
        try {
            console.log('paso por 4')
            const resetFetch = await fetch('http://192.168.0.17:3000/user/editar', {
                
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: user.id,
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    birthday: birthday?.toISOString().split('T')[0], // Formato yyyy-mm-d
                    password: user.password,
                role: user.role,
                }),
            });
    

            console.log('paso por 2')
            if (resetFetch.ok) {
                setMessageColor('green');
                setMessage('Perfil actualizado exitosamente');
    
                // Aquí podrías redirigir a la pantalla de perfil u otra pantalla
            } else {
                console.log(resetFetch )
                const response = await resetFetch.json();
                setError(response.error);
                console.log('paso por 6')
            }
        } catch (error) {
            console.log('paso por 3')
            console.error('Error:', error);
            setMessageColor('red');
            setMessage('Error al actualizar el perfil');
        } finally {
            console.log('paso por 5')
            setLoading(false);
        }
    };
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <View style={{ flex: 1, marginHorizontal: 22 }}>
                <View style={{ marginVertical: 22 }}>
                    <Text style={{ fontSize: 22, fontWeight: 'bold', marginVertical: 12, color: COLORS.black }}>
                        Editar Perfil
                    </Text>
                    <Text style={{ fontSize: 16, color: COLORS.black }}>Actualiza tus datos personales</Text>
                </View>
                <View style={{ marginBottom: 12 }}>
                    <Text>Nombre</Text>
                    <TextInput
                        defaultValue={firstName}
                        placeholderTextColor={COLORS.black}
                        onChangeText={setName}
                        style={{ width: '100%', height: 48, borderColor: COLORS.black, borderWidth: 1, borderRadius: 8, paddingLeft: 22 }}
                    />
                </View>
                <View style={{ marginBottom: 12 }}>
                    <Text>Apellido</Text>
                    <TextInput
                        defaultValue={lastName}
                        placeholderTextColor={COLORS.black}
                        onChangeText={setLastName}
                        style={{ width: '100%', height: 48, borderColor: COLORS.black, borderWidth: 1, borderRadius: 8, paddingLeft: 22 }}
                    />
                </View>
                <View style={{ marginBottom: 12 }}>
                    <Text>Email</Text>
                    <TextInput
                        defaultValue={email}
                        placeholderTextColor={COLORS.black}
                        onChangeText={setEmail}
                        keyboardType='email-address'
                        style={{ width: '100%', height: 48, borderColor: COLORS.black, borderWidth: 1, borderRadius: 8, paddingLeft: 22 }}
                    />
                </View>
                <View style={{ marginVertical: 10 }}>
                    <TouchableOpacity onPress={handleDateOfBirthPress}>
                        <Text>Selecciona tu fecha de nacimiento</Text>
                        <Text>{birthday ? birthday.toLocaleDateString('en-US') : 'Elegir fecha'}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={birthday || new Date()}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                        />
                    )}
                </View>
                <Button
                    title="Guardar Cambios"
                    filled
                    onPress={handleSaveProfile}
                    style={{ marginTop: 18, marginBottom: 4 }}
                />
                <View style={{ alignItems: 'center', marginTop: 20 }}>
                    <Text style={{ color: messageColor }}>{message}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Home')} // Cambiado a goBack() para volver a la pantalla anterior
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: COLORS.white,
                        paddingVertical: 12,
                        borderRadius: 8,
                        marginTop: 20,
                    }}
                >
                    <Text style={{ fontSize: 16, color: COLORS.primary }}>Volver al inicio</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default ProfileEdit;
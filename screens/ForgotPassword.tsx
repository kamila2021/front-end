import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../constants/colors';
import Button from '../components/Button';

const ForgotPassword = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [ error, setError ] = useState<string>('');


  const validateEmail = (text: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(text) && text.trim().length > 0;
  };

  const handleForgotPassword = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Ingrese un correo electrónico válido');
      return;
    }
    setLoading(true);
    
    try {
      const forgotFetch  = await fetch('http://192.168.0.17:3000/user/request-reset-password', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
        })
      })
      if (forgotFetch.ok){
        setError('')
        navigation.navigate('ResetPassword', {email: email})
      }
      else if (forgotFetch.status === 500) {
        Alert.alert('Usuario no registrado');
      }
      else{
        const response = await forgotFetch.json();
        setError(response.error);
      }
    } catch (error){
      setError('Connection error')
    }
    setLoading(false);
  }


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 0.2, marginHorizontal: 50, justifyContent: 'center' }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', marginVertical: 40, color: COLORS.black }}>
                        Olvide mi contraseña!
                    </Text>
                    </View>
      <View style={{ flex: 0.5, marginHorizontal: 22, justifyContent: 'center' }}>
        <Text style={{ fontSize: 20, color: COLORS.black }}>
          Ingresa tu correo electrónico para restablecer tu contraseña.
        </Text>
        <View style={{ marginTop: 40 }}>
          <Text>Email</Text>
          <TextInput
            placeholder='Ingresa tu correo'
            placeholderTextColor={COLORS.black}
            value={email}
            onChangeText={setEmail}
            style={{ width: '100%', height: 50, borderColor: COLORS.black, borderWidth: 1, borderRadius: 8, paddingLeft: 22 }}
          />
        </View>
        <Button
          title="Solicitar restablecimiento"
          onPress={handleForgotPassword}
          filled
          style={{ marginTop: 30, marginBottom: 4 }}
        />
    <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: COLORS.lightGray,
                        paddingVertical: 12,
                        borderRadius: 8,
                        marginTop: 20,
                    }}
                >
                    <Text style={{ fontSize: 16, color: COLORS.primary }}>Volver a login</Text>
                </TouchableOpacity>
        {loading && <ActivityIndicator size="large" color={COLORS.primary} />}
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
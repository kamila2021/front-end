import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import useStore from '../stores/useStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../Router';
import 'text-encoding-polyfill';
import Joi from 'joi';

const loginSchema = Joi.object({
  user: Joi.string().email({ tlds: { allow: false } }).required(),
});

const recuperarContra = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { setUser: setUserStore } = useStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<string>('');
  const [errorMessageUser, setErrorMessageUser] = useState<string>('');
  const [randomNumber, setRandomNumber] = useState<number>(0);

  useEffect(() => {
    const errors = loginSchema.validate({ user });
    if (errors.error) {
      setErrorMessageUser(errors.error.message);
    } else {
      setErrorMessageUser('');
    }
  }, [user]);

  const generateRandomNumber = () => {
    const random = Math.floor(100000 + Math.random() * 900000); //backend
    setRandomNumber(random);
  };

  const onLogin = async () => {
    setLoading(true);
    // Aquí enviarías el correo electrónico y el número aleatorio generado al servidor
    setTimeout(() => {
      setLoading(false);
      setUserStore(user);
      navigation.navigate('Home');
    }, 3000);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingHorizontal: '10%',
        paddingVertical: '5%',
      }}
    >
      <Text
        style={{
          fontSize: 30,
          textAlign: 'center',
          fontWeight: '700',
          marginVertical: '10%',
        }}
      >
        MarcApp
      </Text>
      <Input
        label="Correo"
        placeholder="Correo"
        errorMessage={errorMessageUser}
        onChangeText={(value: string) => setUser(value)}
      />
      <Button title="Generar Número Aleatorio" onPress={generateRandomNumber} />
      {randomNumber !== 0 && (
        <Text style={{ textAlign: 'center', marginTop: '5%' }}>
          Tu número aleatorio es: {randomNumber}
        </Text>
      )}
      <Button title="Login" onPress={onLogin} loading={loading} />
      <View
        style={{
          flexDirection: 'column',
          alignContent: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          onPress={() => navigation.navigate('Register')}
          style={{ textAlign: 'center', marginTop: '10%' }}
        >
          Crear cuenta
        </Text>
      </View>
    </View>
  );
};

export default recuperarContra;

import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import useStore from '../stores/useStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../Router';
import 'text-encoding-polyfill';
import Joi from 'joi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const loginSchema = Joi.object({
  user: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(1).max(50).required(),
});

const Login = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { setUser: setUserStore } = useStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<string>('');
  const [errorMessageUser, setErrorMessageUser] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessagePassword, setErrorMessagePassword] = useState<string>('');
  const [ messageColor, setMessageColor] = useState<'red' | 'green' | 'black'>('black');

  const handleLogin = async () => {
    if (user == '' || password == '') return null;
    setLoading(true);
    /// try catch if backend is down
    const loginFetch = await fetch(`${process.env.MS_USERS_URL}/auth/login`,{
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user: user,
        password: password,
      })
    })
    

    if (loginFetch.status == 201){
      const data = await loginFetch.json();
      setMessageColor('green');
      await AsyncStorage.setItem('token', data.token);
      setErrorMessageUser(`OK! ${await AsyncStorage.getItem('token')}`)
    }
    else{
      const data = await loginFetch.json();
      setMessageColor('red');
      setErrorMessageUser(data.message);
    }
    setLoading(false);
  }
  
  useEffect(() => {
    const errors = loginSchema.validate({ user, password }, { abortEarly: false });

    if (errors.error) {
      errors.error.details.forEach(detail => {
        if (detail.context && detail.context.key === 'user') {
          setErrorMessageUser(detail.message);
        } else if (detail.context && detail.context.key === 'password') {
          setErrorMessagePassword(detail.message);
        }
      });
    } else {
      setErrorMessageUser('');
      setErrorMessagePassword('');
    }
  }, [user, password]);

  const onLogin = async () => {
    const payload = { user, password };
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setUserStore(user);
      navigation.navigate('Home');
    }, 3000);
    // const response = await loginService(payload);
  };

  const goToPasswordRecovery = () => {
    navigation.navigate("RecuperarContra"); // Navegar a la pantalla de recuperación de contraseña
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
      <Input
        secureTextEntry
        label="Contraseña"
        placeholder="********"
        errorMessage={errorMessagePassword}
        onChangeText={(value: string) => setPassword(value)}
      />
      <Button title="Login" onPress={onLogin} loading={loading} />
      <Button title="Recuperar Contraseña" onPress={goToPasswordRecovery} /> 
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

export default Login;

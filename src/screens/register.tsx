import { Box, Button, Center, Input, Text, VStack } from 'native-base';
import { useEffect,useRef, useState } from 'react';
import registerService from '../services/register.services';
import { AlertDialog } from 'native-base';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../Router';
import DateInput from './dateInput';
import validator from 'validator';


type FormDataT = {
  name: string;
  lastName: string;
  email: string;
  password: string;
  birthdate: string;
};

const InitData = {
  name: '',
  lastName: '',
  email: '',
  password: '',
  birthdate: '',
};

const Register = () => {
  const [ fullName, setFullName ] = useState<string>('');
  const [data, setData] = useState<FormDataT>(InitData);
  const [alert, setAlert] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const cancelRef = useRef(null);
  const [ password, setPassword ] = useState<string>('');
  const [ confirmPassword, setConfirmPassword ] = useState<string>('');
  const [ passwordColor, setPasswordColor ] = useState<'gray' | 'red'>('gray')
  
  const [ birthday, setBirthday ] = useState<Date | undefined>(undefined);
  const [ showDateTimePicker, setShowDateTimePicker ] = useState<boolean>(false);
  
  const [ messageColor, setMessageColor] = useState<'red' | 'green' | 'black'>('black');

  const [user, setUser] = useState<string>('');
  const [errorMessageUser, setErrorMessageUser] = useState<string>('');
  

  useEffect(() => {
    if (password != confirmPassword) {
      setPasswordColor('red');
    }
    else{
      setPasswordColor('gray');
    }
  }, [password, confirmPassword])

  const setValue = (key: string, value: string) => {
    setData((prevState) => {
      return {
        ...prevState,
        [key]: value,
      };
    });
  };

  const onClickButton = async () => {
    setLoading(true);
    const response = await registerService(data);

    setLoading(false);
    setMessage((response?.data || response?.error) as string);
    setAlert(true);

    if (response?.success) {
      setData(InitData);
      navigation.navigate('Home');
    }
  };
  const handleRegister = async () => {
    if (user == '' || password == '' || confirmPassword == '' || birthday == undefined) return null;
    if (!validator.isEmail(user)) return null;
    if (password != confirmPassword) return null;
    setLoading(true);
    /// try catch if backend is down
    const registerReq = await fetch(`${process.env.MS_USERS_URL}/auth/register`,{
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: fullName,
        birthday: birthday.toISOString(),
        email: user,
        password: password,
      })
    })
    if (registerReq.status == 201){
      setMessage('')
      navigation.navigate('Login')
    }
    else{
      const data = await registerReq.json();
      setMessageColor('red');
      setMessage(data.message);
    }
    setLoading(false);
} 

  return (
    <Box
      style={{
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        marginHorizontal: '7%',
        marginVertical: '10%',
      }}
    >
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={alert}
        onClose={() => setAlert(false)}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Body>{message}</AlertDialog.Body>
        </AlertDialog.Content>
      </AlertDialog>
      <VStack space={4} alignItems="center">
        <Center>
          <Text>MarcApp</Text>
        </Center>
        <Center>
          <Input
            size="l"
            variant="outline"
            placeholder="Nombre"
            value={data?.name}
            onChange={(e) => setValue('name', e?.nativeEvent?.text as string)}
          />
        </Center>
        <Center>
          <Input
            size="l"
            variant="outline"
            placeholder="Apellido"
            value={data?.lastName}
            onChange={(e) =>
              setValue('lastName', e?.nativeEvent?.text as string)
            }
          />
        </Center>
        <Center>
          <Input
            size="l"
            variant="outline"
            placeholder="Email"
            value={data?.email}
            onChange={(e) => setValue('email', e?.nativeEvent?.text as string)}
          />
        </Center>
        <Center>
          <Input
            size="l"
            type="password"
            variant="outline"
            placeholder="Contraseña"
            value={data?.password}
            onChange={(e) =>
              setValue('password', e?.nativeEvent?.text as string)
            }
          />
        </Center>
        <Center>
          <Input
            size="l"
            variant="outline"
            placeholder="Fecha de nacimiento"
            value={data?.birthdate}
            onChange={(e) => {
              const value = String(e?.nativeEvent?.text);
              const formattedValue = value
                .replace(/-/g, '')
                .replace(/(\d{4})(\d{1,2})(\d{1,2})/, '$1-$2-$3');
              setValue('birthdate', formattedValue);
            }}
          />
        </Center>
        <Center>
          <Button isLoading={loading} onPress={onClickButton}>
            Crear cuenta
          </Button>
        </Center>
        <Center>
          <Text
            style={{ marginTop: '5%' }}
            onPress={() => navigation.navigate('Login')}
          >
            Ya tengo cuenta
          </Text>
        </Center>
      </VStack>
    </Box>
  );
};


export default Register;

import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';

import { useNavigation } from '@react-navigation/native';
import 'text-encoding-polyfill';
import Joi from 'joi';
const cambiarContraSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  newPassword: Joi.string().min(1).required(),
});

const CambiarContra = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [errorMessageEmail, setErrorMessageEmail] = useState<string>('');
  const [errorMessageNewPassword, setErrorMessageNewPassword] = useState<string>('');

  const onChangeEmail = (value: string) => {
    setEmail(value);
    setErrorMessageEmail('');
  };

  const onChangeNewPassword = (value: string) => {
    setNewPassword(value);
    setErrorMessageNewPassword('');
  };

  const onSubmit = async () => {
    const { error } = cambiarContraSchema.validate({ email, newPassword }, { abortEarly: false });

    if (error) {
      error.details.forEach((detail) => {
        if (detail.path[0] === 'email') {
          setErrorMessageEmail(detail.message);
        } else if (detail.path[0] === 'newPassword') {
          setErrorMessageNewPassword(detail.message);
        }
      });
    } else {
      // Lógica para enviar la solicitud de cambio de contraseña
      console.log('Solicitud enviada:', { email, newPassword });
      navigation.goBack(); // Volver a la pantalla anterior
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: '10%' }}>
      <Text h3 style={{ marginBottom: 20 }}>Cambiar Contraseña</Text>
      <Input
        label="Correo Electrónico"
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={onChangeEmail}
        errorMessage={errorMessageEmail}
      />
      <Input
        label="Nueva Contraseña"
        placeholder="Nueva Contraseña"
        value={newPassword}
        onChangeText={onChangeNewPassword}
        secureTextEntry
        errorMessage={errorMessageNewPassword}
      />
      <Button title="Enviar Solicitud" onPress={onSubmit} />
    </View>
  );
};

export default CambiarContra;

import React from 'react';
import { TextInput } from 'react-native';

interface DateInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

const dateInput: React.FC<DateInputProps> = ({ value, onChangeText }) => {
  const onChangeTextWithMask = (text: string) => {
    // Aplicar la máscara YYYY-MM-DD a la entrada del usuario
    if (/^\d{4}$/.test(text)) {
      onChangeText(`${text}-`);
    } else if (/^\d{4}-\d{2}$/.test(text)) {
      onChangeText(`${text}-`);
    } else {
      onChangeText(text);
    }
  };

  return (
    <TextInput
      keyboardType="numeric"
      placeholder="YYYY-MM-DD"
      value={value}
      onChangeText={onChangeTextWithMask}
      maxLength={10} // Limitar la longitud máxima del campo a 10 caracteres
    />
  );
};

export default dateInput;

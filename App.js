import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from './screens/Login'; 
import Signup from './screens/Signup'; 
import ForgotPassword from './screens/ForgotPassword'; 
import ResetPassword from './screens/ResetPassword'; // Importa la pantalla de ResetPassword
import Home from './screens/Home';
import RegisterTime from './screens/RegisterTime';
import Resumen from './screens/Resumen';
import ProfileEdit  from './screens/ProfileEdit';
import WeeklySummary from './screens/WeeklySummary';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Login'
      >
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="ResetPassword" 
          component={ResetPassword}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="RegisterTime"
          component={RegisterTime}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Resumen"
          component={Resumen}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="ProfileEdit"
          component={ProfileEdit}
          options={{
            headerShown: false
          }}
        />
         <Stack.Screen
          name="WeeklySummary"
          component={WeeklySummary}
          options={{
            headerShown: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import SignIn from './src/pages/SignIn';
import Welcome from './src/pages/Welcome';
import SignUp from './src/pages/SignUp';
import Home from './src/pages/Home';
import Contas from './src/pages/Contas';
import Categoria from './src/pages/Categoria';
import Movimentacao from './src/pages/Movimentacao';
import Perfil from './src/pages/Perfil';

const Tab = createBottomTabNavigator();

function MainTabs({ route }) {
  const { token } = route.params;
  const [validationResult, setValidationResult] = React.useState(null);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={Home}
        initialParams={{ token, setValidationResult }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Gráfico"
        component={Contas}
        initialParams={{ token, validationResult }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="chart-line" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Movimentação"
        component={Movimentacao}
        initialParams={{ token, validationResult }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="exchange-alt" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={Perfil}
        initialParams={{ token, validationResult }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();

function Routes() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Login" component={SignIn} />
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Home" component={MainTabs} />
      <Stack.Screen name="Contas" component={Contas} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Routes />
    </NavigationContainer>
  );
}

// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import SignIn from './src/pages/SignIn';
import Welcome from './src/pages/Welcome';
import SignUp from './src/pages/SignUp';
import Home from './src/pages/Home';
import Contas from './src/pages/Contas';
import Categoria from './src/pages/Categoria';
import Movimentacao from './src/pages/Movimentacao';

const Tab = createBottomTabNavigator();

function MainTabs({ route }) {
  const { token } = route.params;
  const [validationResult, setValidationResult] = React.useState(null);

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home">
        {(props) => (
          <Home
            {...props}
            route={{
              ...props.route,
              params: { token, setValidationResult },
            }}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Contas">
        {(props) => (
          <Contas
            {...props}
            route={{
              ...props.route,
              params: { token, validationResult },
            }}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Categoria">
        {(props) => (
          <Categoria
            {...props}
            route={{
              ...props.route,
              params: { token, validationResult },
            }}
          />
        )}
      </Tab.Screen>

      <Tab.Screen name="Movimentação">
        {(props) => (
          <Movimentacao
            {...props}
            route={{
              ...props.route,
              params: { token, validationResult },
            }}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();

function Routes() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={SignIn} />
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Home" component={MainTabs} />
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

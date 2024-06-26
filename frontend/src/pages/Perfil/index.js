import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';


const ProfileScreen = ({ navigation, route }) => {
  const { token, validationResult } = route.params;

  const goToEditProfile = () => {
    navigation.navigate('EditarUsuario', { token });
  };

  const goToAccounts = () => {
    navigation.navigate('Contas', { token, validationResult });
  };

  const goToCategories = () => {
    navigation.navigate('Categoria', { token, validationResult });
  };

  const goToLogout = async () => {
    try {
      await axios.post('http://172.16.4.17:8000/api/Autenticacao/logout', null, {
        headers: {
          Authorization: `Token ${token}`
        }
      });
      // Após logout, navegar para a tela inicial ou outra tela desejada
      navigation.navigate('Login'); // Exemplo: navegação para a tela de login
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Tratar erro, se necessário
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      {/* <View style={styles.buttonContainer}>
        <Button title="Editar Perfil" onPress={goToEditProfile} />
      </View> */}
      <View style={styles.buttonContainer}>
        <Button title="Contas" onPress={goToAccounts} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Categorias" onPress={goToCategories} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Sair" onPress={goToLogout} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  buttonContainer: {
    width: '80%',
    marginBottom: 16,
  },
});

export default ProfileScreen;

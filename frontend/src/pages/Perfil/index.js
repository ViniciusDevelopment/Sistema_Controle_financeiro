import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ProfileScreen = ({ navigation }) => {
  const goToEditProfile = () => {
    // Implementar a navegação para a tela de edição de perfil
    // Exemplo: navigation.navigate('EditProfile');
    alert('Navegar para a tela de Edição de Perfil');
  };

  const goToAccounts = () => {
    // Implementar a navegação para a tela de contas
    // Exemplo: navigation.navigate('Accounts');
    alert('Navegar para a tela de Contas');
  };

  const goToCategories = () => {
    // Implementar a navegação para a tela de categorias
    // Exemplo: navigation.navigate('Categories');
    alert('Navegar para a tela de Categorias');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <View style={styles.buttonContainer}>
        <Button title="Editar Perfil" onPress={goToEditProfile} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Contas" onPress={goToAccounts} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Categorias" onPress={goToCategories} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Sair" onPress={goToCategories} />
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

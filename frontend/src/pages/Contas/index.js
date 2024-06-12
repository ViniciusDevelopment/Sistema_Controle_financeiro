// Contas.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function Contas({ route }) {
  const { token, validationResult } = route.params;
  const [nomeConta, setNomeConta] = useState('');

  const cadastrarConta = async () => {
    try {
      console.log(validationResult)
      const config = {
        headers: {
          Authorization: `Token ${token}` // Inclui o token no cabeçalho da requisição
        }
      };

      const response = await axios.post(
        'http://172.16.4.17:8000/api/Financa/conta/',
        { user: validationResult.id, nome: nomeConta },
        config
      );

      Alert.alert('Sucesso', 'Conta cadastrada com sucesso!');
      setNomeConta(''); // Limpar o campo de nome da conta após o cadastro
    } catch (error) {
      console.error('Erro ao cadastrar conta:', error);
      Alert.alert('Erro', 'Falha ao cadastrar conta');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome da Conta:</Text>
      <TextInput
        style={styles.input}
        value={nomeConta}
        onChangeText={setNomeConta}
        placeholder="Digite o nome da conta"
      />
      <Button title="Cadastrar Conta" onPress={cadastrarConta} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

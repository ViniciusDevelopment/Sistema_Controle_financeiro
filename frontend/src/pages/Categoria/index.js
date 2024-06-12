// categorias.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

export default function Categoria({ route }) {
  const { token, validationResult } = route.params;
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('receita');

  const cadastrarCategoria = async () => {
    try {
      console.log(validationResult)
      const config = {
        headers: {
          Authorization: `Token ${token}` // Inclui o token no cabeçalho da requisição
        }
      };

      const response = await axios.post(
        'http://172.16.4.17:8000/api/Financa/categoria/',
        { tipo: tipo, nome: nome },
        config
      );

      Alert.alert('Sucesso', 'categoria cadastrada com sucesso!');
      setNome(''); // Limpar o campo de nome da categoria após o cadastro
    } catch (error) {
      console.error('Erro ao cadastrar categoria:', error);
      Alert.alert('Erro', 'Falha ao cadastrar categoria');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome:</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Digite o nome da categoria"
      />
      <Text style={styles.label}>Tipo:</Text>
      <Picker
        selectedValue={tipo}
        style={styles.picker}
        onValueChange={(itemValue, itemIndex) => setTipo(itemValue)}
      >
        <Picker.Item label="Receita" value="receita" />
        <Picker.Item label="Despesa" value="despesa" />
        <Picker.Item label="Transferência" value="transferencia" />
      </Picker>
      <Button title="Adicionar Categoria" onPress={cadastrarCategoria} />
    </View>
  );
};

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
    picker: {
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      marginBottom: 16,
    },
  });
  
//   export default CategoriaForm;
  

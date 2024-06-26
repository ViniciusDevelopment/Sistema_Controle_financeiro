import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform} from 'react-native';
import axios from 'axios';

export default function EditarUsuario({ route, navigation }) {
  const { token, setValidationResult } = route.params;
  const [validationResultLocal, setValidationResultLocal] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await axios.post('http://172.16.4.17:8000/api/Autenticacao/tokenvalidation', { token });
        setValidationResultLocal(response.data);
      } catch (error) {
        console.error('Error validating token:', error);
        setValidationResultLocal({ error: 'Failed to validate token' });
      }
    };

    validateToken();
  }, [token, setValidationResultLocal]);

  const handleSignUp = () => {

    // Exemplo usando fetch:
    fetch(`http://172.16.4.17:8000/api/Autenticacao/usuario/${validationResultLocal.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`
      },
      body: JSON.stringify({
        username,
        email
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Response:', data);
      let errorMessage = '';

  // Itera sobre as chaves do objeto data
  Object.keys(data).forEach(key => {
    // Verifica se há mensagens de erro para a chave atual
    if (data[key].length > 0) {
      // Adiciona a mensagem de erro formatada para a chave atual
      errorMessage += `${key}: ${data[key][0]}\n`;
    }
  });

      if (Platform.OS === 'web') {
        if(data && data.message){
          alert('Usuário alterado com sucesso!');
        }
        else{
          alert(`${errorMessage}`);
        }
    } else {
      if(data && data.message){
        Alert.alert('Usuário alterado com sucesso!');
      }
      else{
        Alert.alert('Usuario', errorMessage);
      }
    }
      
    })
    .catch(error => {
      console.error('Error:', error);
      // Aqui você pode tratar o erro da requisição, por exemplo, exibindo uma mensagem de erro
      Alert.alert('Erro', 'Ocorreu um erro ao criar o usuário. Por favor, tente novamente.');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alterar Usuario</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
     
      <Button title="Alterar" onPress={handleSignUp} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

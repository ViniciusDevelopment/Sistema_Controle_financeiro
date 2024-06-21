import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform} from 'react-native';

export default function SignUp({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      if (Platform.OS === 'web') {
        
        alert('A senha e a confirmação de senha não correspondem.');
    } else {
      Alert.alert('Erro', 'A senha e a confirmação de senha não correspondem.');
    }
      
      return;
    }

    // Exemplo usando fetch:
    fetch('http://172.16.4.17:8000/api/Autenticacao/create-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
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
          alert('Usuário criado com sucesso!');
        }
        else{
          alert(`${errorMessage}`);
        }
    } else {
      if(data && data.message){
        Alert.alert('Usuário criado com sucesso!');
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
      <Text style={styles.title}>Cadastro</Text>
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
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Button title="Cadastrar" onPress={handleSignUp} />
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

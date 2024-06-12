import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker'; // Importe Picker corretamente
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Movimentacao({ route }) {
  const { token, validationResult } = route.params;
  const [contas, setContas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [contaSelecionada, setContaSelecionada] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataMovimentacao, setDataMovimentacao] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    // Função para carregar contas do servidor
    const fetchContas = async () => {
      try {
        const response = await axios.get('http://172.16.4.17:8000/api/Financa/conta/', {
          headers: {
            Authorization: `Token ${token}`
          }
        });
        setContas(response.data);
      } catch (error) {
        console.error('Erro ao carregar contas:', error);
      }
    };

    // Função para carregar categorias do servidor
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('http://172.16.4.17:8000/api/Financa/categoria/', {
          headers: {
            Authorization: `Token ${token}`
          }
        });
        setCategorias(response.data);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    };

    fetchContas();
    fetchCategorias();
  }, []);

  const cadastrarMovimentacao = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Token ${token}`
        }
      };

      console.log({
        conta: contaSelecionada,
        categoria: Number(categoriaSelecionada),
        valor: Number(valor),
        descricao: descricao,
        movimentado_em: dataMovimentacao.toISOString() 
      });

      const response = await axios.post(
        'http://172.16.4.17:8000/api/Financa/movimentacao/',
        {
          conta: contaSelecionada,
          categoria: Number(categoriaSelecionada), // Converter para número
          valor: Number(valor),
          descricao: descricao,
          movimentado_em: dataMovimentacao.toISOString() // Converter para formato ISO
        },
        config
      );

      Alert.alert('Sucesso', 'Movimentação cadastrada com sucesso!');
      // Limpar campos após o cadastro
      setContaSelecionada('');
      setCategoriaSelecionada('');
      setValor('');
      setDescricao('');
      setDataMovimentacao(new Date());
    } catch (error) {
      console.error('Erro ao cadastrar movimentação:', error);
      Alert.alert('Erro', 'Falha ao cadastrar movimentação');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Conta:</Text>
      <Picker
        selectedValue={contaSelecionada}
        onValueChange={(itemValue, itemIndex) => setContaSelecionada(itemValue)}
      >
        <Picker.Item label="Selecione uma conta" value="" />
        {contas.map(conta => (
          <Picker.Item key={conta.id} label={conta.nome} value={conta.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Categoria:</Text>
      <Picker
        selectedValue={categoriaSelecionada}
        onValueChange={(itemValue, itemIndex) => setCategoriaSelecionada(itemValue)}
      >
        <Picker.Item label="Selecione uma categoria" value="" />
        {categorias.map(categoria => (
          <Picker.Item key={categoria.id} label={categoria.nome} value={categoria.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Valor:</Text>
      <TextInput
        style={styles.input}
        value={valor}
        onChangeText={setValor}
        placeholder="Digite o valor"
      />

      <Text style={styles.label}>Descrição:</Text>
      <TextInput
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Digite a descrição"
      />

      <Text style={styles.label}>Data da Movimentação:</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <TextInput
          style={styles.input}
          value={dataMovimentacao.toDateString()}
          editable={false}
        />
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dataMovimentacao}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            setDataMovimentacao(selectedDate || dataMovimentacao);
          }}
        />
      )}

      <Button title="Cadastrar Movimentação" onPress={cadastrarMovimentacao} />
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
  });

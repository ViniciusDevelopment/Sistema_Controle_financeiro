import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Movimentacao({ route }) {
  const { token, setValidationResult } = route.params;
  const [validationResultLocal, setValidationResultLocal] = useState(null);
  const [contas, setContas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [contaSelecionada, setContaSelecionada] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataMovimentacao, setDataMovimentacao] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tipoMovimentacao, setTipoMovimentacao] = useState('receita');
  const [contaDestino, setContaDestino] = useState('');
  const [showContaDestino, setShowContaDestino] = useState(false); // Estado para controlar a visibilidade do campo de conta destino

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

  useEffect(() => {
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

    const fetchCategorias = async () => {
      try {
        if (validationResultLocal) {
          const response = await axios.get(`http://172.16.4.17:8000/api/Financa/GetCategoriaTipo/${validationResultLocal.id}/${tipoMovimentacao}/`, {
            headers: {
              Authorization: `Token ${token}`
            }
          });
          setCategorias(response.data);
        }
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    };

    fetchContas();
    fetchCategorias();
  }, [tipoMovimentacao, token, validationResultLocal]);

  const cadastrarMovimentacao = async () => {
    const url = 'http://172.16.4.17:8000/api/Financa/CadastrarMovimentacao';
  
    let movimentacaoData = {
      conta: contaSelecionada,
      categoria: Number(categoriaSelecionada),
      valor: Number(valor),
      descricao: descricao,
      movimentado_em: dataMovimentacao.toISOString()
    };
  
    if (tipoMovimentacao === 'transferencia') {
      movimentacaoData = {
        ...movimentacaoData,
        conta_destino: contaDestino // Adicionando conta de destino apenas para transferências
      };
    }
  
    try {
      console.log(`Token ${token}`)
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`
        },
        body: JSON.stringify(movimentacaoData)
      });
  
      const responseData = await response.json();
      const cleanedResponse = responseData.replace(/[,.\[\]{}'""\""]/g, '');
  
      // Exibe o conteúdo da resposta no alert
      alert(JSON.stringify(cleanedResponse));
      // Alert.alert(cleanedResponse);
  
      // Limpa os campos do formulário
      setContaSelecionada('');
      setCategoriaSelecionada('');
      setValor('');
      setDescricao('');
      setDataMovimentacao(new Date());
      setContaDestino('');
    } catch (error) {
      // Trata erros caso ocorram durante a requisição
      console.error('Erro ao cadastrar movimentação:', error);
      Alert.alert('Erro', 'Não foi possível cadastrar a movimentação. Por favor, tente novamente mais tarde.');
    }
  };
  
  
  

  const handleTipoMovimentacao = (tipo) => {
    setTipoMovimentacao(tipo);
    // Exibir o campo de conta destino apenas quando for uma transferência
    setShowContaDestino(tipo === 'transferencia');
  };

  return (
    <View style={styles.container}>
      <View style={styles.opcoesContainer}>
        <TouchableOpacity
          style={[styles.opcaoButton, tipoMovimentacao === 'receita' ? styles.opcaoButtonSelected : null]}
          onPress={() => handleTipoMovimentacao('receita')}
        >
          <Text style={[styles.opcaoText, tipoMovimentacao === 'receita' ? styles.opcaoTextSelected : null]}>Receita</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.opcaoButton, tipoMovimentacao === 'despesa' ? styles.opcaoButtonSelected : null]}
          onPress={() => handleTipoMovimentacao('despesa')}
        >
          <Text style={[styles.opcaoText, tipoMovimentacao === 'despesa' ? styles.opcaoTextSelected : null]}>Despesa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.opcaoButton, tipoMovimentacao === 'transferencia' ? styles.opcaoButtonSelected : null]}
          onPress={() => handleTipoMovimentacao('transferencia')}
        >
          <Text style={[styles.opcaoText, tipoMovimentacao === 'transferencia' ? styles.opcaoTextSelected : null]}>Transferência</Text>
        </TouchableOpacity>
      </View>

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

      {showContaDestino && (
        <>
          <Text style={styles.label}>Conta Destino:</Text>
          <Picker
            selectedValue={contaDestino}
            onValueChange={(itemValue, itemIndex) => setContaDestino(itemValue)}
          >
            <Picker.Item label="Selecione uma conta de destino" value="" />
            {contas.map(conta => (
              <Picker.Item key={conta.id} label={conta.nome} value={conta.id} />
            ))}
          </Picker>
        </>
      )}

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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  opcoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  opcaoButton: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#fff',
  },
  opcaoButtonSelected: {
    backgroundColor: '#007AFF',
  },
  opcaoText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  opcaoTextSelected: {
    color: '#fff',
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

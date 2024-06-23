import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Platform } from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

export default function DetalharMovimentacoes({ route, navigation }) {
  const { token } = route.params;
  const { movimentacao } = route.params;

  const [validationResultLocal, setValidationResultLocal] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [modalVisibleDelete, setModalVisibleDelete] = useState(false);
  const [modalVisibleEdit, setModalVisibleEdit] = useState(false);
  const [novoNomeMovimentacao, setNovoNomeMovimentacao] = useState(movimentacao.descricao);
  const [novoValorMovimentacao, setNovoValorMovimentacao] = useState(movimentacao.valor.toString());
  const [novaDataMovimentacao, setNovaDataMovimentacao] = useState(new Date(movimentacao.movimentado_em));
  const [novaContaOrigem, setNovaContaOrigem] = useState(movimentacao.conta);
  const [novaContaDestino, setNovaContaDestino] = useState(movimentacao.conta_destino || '');
  const [novaCategoria, setNovaCategoria] = useState(movimentacao.categoria.toString());
  const [error, setError] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [contas, setContas] = useState([]);
  const [contaSelecionada, setContaSelecionada] = useState('');

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await axios.post('http://172.16.4.17:8000/api/Autenticacao/tokenvalidation', { token });
        setValidationResultLocal(response.data);
      } catch (error) {
        console.error('Error validating token:', error);
        setValidationResultLocal({ error: 'Failed to validate token' });
        setError('Failed to validate token');
      }
    };

    validateToken();
  }, [token]);

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

      fetchContas();
}, [validationResultLocal, token]);

  useEffect(() => {
    if (validationResultLocal && validationResultLocal.id) {
      const fetchCategorias = async () => {
        try {
          const responseCategorias = await axios.get('http://172.16.4.17:8000/api/Financa/categoria/', {
            headers: {
              Authorization: `Token ${token}`
            }
          });
          setCategorias(responseCategorias.data);
        } catch (error) {
          console.error('Error fetching categorias:', error);
          setError('Error fetching categorias');
        }
      };

      fetchCategorias();
    }
  }, [validationResultLocal, token]);

  const getCorPorTipo = (tipo) => {
    switch (tipo) {
      case 'receita':
        return '#32CD32';
      case 'despesa':
        return '#FF6347';
      case 'transferencia':
        return '#FFD700';
      default:
        return '#808080';
    }
  };

  const renderCategoria = (categoriaId) => {
    const categoria = categorias.find(cat => cat.id === parseInt(categoriaId));
    if (categoria) {
      const cor = getCorPorTipo(categoria.tipo);
      return (
        <Text style={{ color: cor }}>{categoria.nome}</Text>
      );
    }
    return null;
  };

  const handleDeleteMovimentacao = async () => {
    try {
      await axios.delete(`http://172.16.4.17:8000/api/Financa/movimentacao/${movimentacao.id}/`, {
        headers: {
          Authorization: `Token ${token}`
        }
      });
      navigation.goBack(); // Voltar para a tela anterior após a exclusão
    } catch (error) {
      console.error('Error deleting movimentacao:', error);
      setError('Error deleting movimentacao');
    }
  };

  const handleEditMovimentacao = async () => {
    try {
      const updatedMovimentacao = {
        descricao: novoNomeMovimentacao,
        valor: parseFloat(novoValorMovimentacao),
        movimentado_em: novaDataMovimentacao.toISOString(),
        conta: parseInt(novaContaOrigem),
        conta_destino: novaContaDestino ? parseInt(novaContaDestino) : null,
        categoria: parseInt(novaCategoria),
        // Adicione outros campos que precisam ser atualizados
      };

      await axios.put(`http://172.16.4.17:8000/api/Financa/movimentacao/${movimentacao.id}/`, updatedMovimentacao, {
        headers: {
          Authorization: `Token ${token}`
        }
      });
      navigation.goBack(); // Voltar para a tela anterior após a alteração
    } catch (error) {
      console.error('Error editing movimentacao:', error);
      setError('Error editing movimentacao');
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || novaDataMovimentacao;
    setShowDatePicker(false);
    setNovaDataMovimentacao(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes da Movimentação</Text>
      <Text style={styles.label}>Conta:</Text>
      <Text style={styles.value}>{movimentacao.nomeConta}</Text>

      {movimentacao.nomeContaDestino && (
        <>
          <Text style={styles.label}>Conta Destino:</Text>
          <Text style={styles.value}>{movimentacao.nomeContaDestino}</Text>
        </>
      )}

      <Text style={styles.label}>Categoria:</Text>
      <Text style={styles.value}>{renderCategoria(movimentacao.categoria)}</Text>

      <Text style={styles.label}>Valor:</Text>
      <Text style={styles.value}>{movimentacao.valor}</Text>

      <Text style={styles.label}>Descrição:</Text>
      <Text style={styles.value}>{movimentacao.descricao}</Text>

      <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => setModalVisibleEdit(true)}>
        <Text style={styles.buttonText}>Alterar</Text>
      </TouchableOpacity>

    {/* Modal de Edição */}
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisibleEdit}
      onRequestClose={() => setModalVisibleEdit(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Alterar Movimentação</Text>

          {/* Descrição da movimentação */}
          <TextInput
            style={styles.input}
            value={novoNomeMovimentacao}
            onChangeText={setNovoNomeMovimentacao}
            placeholder="Descrição da movimentação"
          />

          {/* Valor da movimentação */}
          <TextInput
            style={styles.input}
            value={novoValorMovimentacao}
            onChangeText={setNovoValorMovimentacao}
            placeholder="Valor da movimentação"
            keyboardType="numeric"
          />

          {/* Data da movimentação */}
          <TouchableOpacity onPress={showDatePickerModal} style={styles.datePickerButton}>
            <Text style={styles.datePickerButtonText}>Selecionar Data</Text>
          </TouchableOpacity>
          {(showDatePicker && Platform.OS === 'ios') && (
            <DateTimePicker
              value={novaDataMovimentacao}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
            />
          )}

          {/* Conta de Origem */}
          <Text style={styles.label}>Conta de Origem:</Text>
          <Picker
            selectedValue={novaContaOrigem}
            onValueChange={(itemValue, itemIndex) => setNovaContaOrigem(itemValue)}
          >
            {contas.map(conta => (
              <Picker.Item key={conta.id} label={conta.nome} value={conta.id} />
            ))}
          </Picker>

          {/* Conta Destino */}
          {/* {movimentacao.tipo === 'transferencia' && (
            <>
              <Text style={styles.label}>Conta Destino:</Text>
              <Picker
                selectedValue={novaContaDestino}
                onValueChange={(itemValue, itemIndex) => setNovaContaDestino(itemValue)}
                style={styles.picker}
              >
                {contas.map(conta => (
                  <Picker.Item key={conta.id} label={conta.nome} value={conta.id} />
                ))}
              </Picker>
            </>
          )} */}





          {/* Conta Destino */}
          {movimentacao.tipo === 'transferencia' && (
            <>
              <Text style={styles.label}>Conta Destino:</Text>
              <Picker
                selectedValue={novaContaDestino}
                onValueChange={(itemValue, itemIndex) => setNovaContaDestino(itemValue)}
                style={styles.picker}
              >
                {movimentacao.nomeContaDestino && (
                  <Picker.Item label={movimentacao.nomeContaDestino} value={movimentacao.conta_destino} />
                )}
                {/* Renderizar outras contas destino disponíveis */}
              </Picker>
            </>
          )}

          {/* Categoria */}
          <Text style={styles.label}>Categoria:</Text>
          <Picker
            selectedValue={novaCategoria}
            onValueChange={(itemValue, itemIndex) => setNovaCategoria(itemValue)}
            style={styles.picker}
          >
            {categorias.map(cat => (
              <Picker.Item key={cat.id} label={cat.nome} value={cat.id.toString()} />
            ))}
          </Picker>

          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={() => setModalVisibleEdit(false)} style={[styles.button, styles.cancelButton]}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEditMovimentacao} style={[styles.button, styles.saveButton]}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>



    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  editButton: {
    backgroundColor: 'green',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    width: '100%',
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
  },
});

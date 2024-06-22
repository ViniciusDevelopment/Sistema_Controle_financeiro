import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import axios from 'axios';

export default function DetalharMovimentacoes({ route, navigation }) {
  const { token, setValidationResult } = route.params;
  const [validationResultLocal, setValidationResultLocal] = useState(null);
  const { movimentacao } = route.params;
  const [categorias, setCategorias] = useState([]);
  const [modalVisibleDelete, setModalVisibleDelete] = useState(false);
  const [modalVisibleEdit, setModalVisibleEdit] = useState(false);
  const [novoNomeMovimentacao, setNovoNomeMovimentacao] = useState(movimentacao.descricao);
  const [novoValorMovimentacao, setNovoValorMovimentacao] = useState(movimentacao.valor);
  const [error, setError] = useState(null);

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
    const categoria = categorias.find(cat => cat.id === categoriaId);
    if (categoria) {
      const cor = getCorPorTipo(categoria.tipo);
      return (
        <Text style={{ color: cor }}>{categoria.tipo} - {categoria.nome}</Text>
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
      await axios.put(`http://172.16.4.17:8000/api/Financa/movimentacao/${movimentacao.id}/`, {
        descricao: novoNomeMovimentacao,
        valor: novoValorMovimentacao,
        // Adicione outros campos que precisam ser atualizados
      }, {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes da Movimentação</Text>
      <Text style={styles.label}>Conta:</Text>
      <Text style={styles.value}>{movimentacao.nomeConta}</Text>
      
      <Text style={styles.label}>Categoria:</Text>
      <Text style={styles.value}>{renderCategoria(movimentacao.categoria)}</Text>
      
      <Text style={styles.label}>Valor:</Text>
      <Text style={styles.value}>{movimentacao.valor}</Text>
      
      <Text style={styles.label}>Descrição:</Text>
      <Text style={styles.value}>{movimentacao.descricao}</Text>
      
      <Text style={styles.label}>Data da Movimentação:</Text>
      <Text style={styles.value}>{movimentacao.movimentado_em}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => setModalVisibleDelete(true)}>
          <Text style={styles.buttonText}>Deletar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => setModalVisibleEdit(true)}>
          <Text style={styles.buttonText}>Alterar</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de Deleção */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleDelete}
        onRequestClose={() => setModalVisibleDelete(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Deletar Movimentação</Text>
            <Text>Tem certeza que deseja deletar esta movimentação?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisibleDelete(false)} style={[styles.button, { backgroundColor: 'red' }]}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteMovimentacao} style={[styles.button, { backgroundColor: 'green' }]}>
                <Text style={styles.buttonText}>Deletar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Edição */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleEdit}
        onRequestClose={() => setModalVisibleEdit(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Alterar Movimentação</Text>
            <TextInput
              style={styles.input}
              value={novoNomeMovimentacao}
              onChangeText={setNovoNomeMovimentacao}
              placeholder="Descrição da movimentação"
            />
            <TextInput
              style={styles.input}
              value={novoValorMovimentacao}
              onChangeText={setNovoValorMovimentacao}
              placeholder="Valor da movimentação"
              keyboardType="numeric"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisibleEdit(false)} style={[styles.button, { backgroundColor: 'red' }]}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleEditMovimentacao} style={[styles.button, { backgroundColor: 'green' }]}>
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

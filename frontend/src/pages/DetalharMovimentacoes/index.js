import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function DetalharMovimentacoes({ route, navigation }) {
  const { token, setValidationResult } = route.params;
  const [validationResultLocal, setValidationResultLocal] = useState(null);
  const { movimentacao } = route.params;
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const validateToken = async () => {
      try {
        console.log('token', token);
        const response = await axios.post('http://172.16.4.17:8000/api/Autenticacao/tokenvalidation', { token });
        setValidationResultLocal(response.data);
      } catch (error) {
        console.error('Error validating token:', error);
        setValidationResultLocal({ error: 'Failed to validate token' });
        setError('Failed to validate token');
      }
    };

    validateToken();
  }, [token, setValidationResultLocal]);

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
});

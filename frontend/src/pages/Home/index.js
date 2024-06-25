import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function Home({ route }) {
  const { token, setValidationResult } = route.params;
  const [validationResultLocal, setValidationResultLocal] = useState(null);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const handlePressMovimentacao = (movimentacao) => {
    navigation.navigate('DetalharMovimentacoes', { movimentacao, token });
  };

  // Efeito para validar o token e atualizar o estado local
  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await axios.post('http://172.16.4.17:8000/api/Autenticacao/tokenvalidation', { token });
        setValidationResultLocal(response.data);
        setValidationResult(response.data); // Passando a resposta para o MainTabs
      } catch (error) {
        console.error('Error validating token:', error);
        setValidationResultLocal({ error: 'Failed to validate token' });
        setValidationResult({ error: 'Failed to validate token' }); // Passando um erro para o MainTabs
        setError('Failed to validate token');
      }
    };

    validateToken();
  }, [token, setValidationResult]);

  // Efeito para buscar movimentações e categorias ao focar na tela
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          if (validationResultLocal && validationResultLocal.id) {
            setLoading(true);
            const responseMovimentacoes = await axios.get(`http://172.16.4.17:8000/api/Financa/GetFinancas/${validationResultLocal.id}/`, {
              headers: {
                Authorization: `Token ${token}`
              }
            });

            const movimentacoesComDetalhes = await Promise.all(
              responseMovimentacoes.data.movimentacoes.map(async (movimentacao) => {
                const responseConta = await axios.get(`http://172.16.4.17:8000/api/Financa/conta/${movimentacao.conta}/`, {
                  headers: {
                    Authorization: `Token ${token}`
                  }
                });

                const detalhesMovimentacao = {
                  ...movimentacao,
                  nomeConta: responseConta.data.nome
                };

                if (movimentacao.conta_destino != null) {
                  const responseContaDestino = await axios.get(`http://172.16.4.17:8000/api/Financa/conta/${movimentacao.conta_destino}/`, {
                    headers: {
                      Authorization: `Token ${token}`
                    }
                  });

                  detalhesMovimentacao.nomeContaDestino = responseContaDestino.data.nome;
                }

                return detalhesMovimentacao;
              })
            );

            setMovimentacoes(movimentacoesComDetalhes);

            // Busca de categorias
            const responseCategorias = await axios.get('http://172.16.4.17:8000/api/Financa/categoria/', {
              headers: {
                Authorization: `Token ${token}`
              }
            });
            setCategorias(responseCategorias.data);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setError('Failed to fetch data');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [token, validationResultLocal])
  );

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

  const renderCategoria = (categoriaId, tipo) => {
    const categoria = categorias.find(cat => cat.id === categoriaId);

    if (!tipo) {
      return categoria.tipo;
    }

    if (categoria) {
      const cor = getCorPorTipo(categoria.tipo);
      return (
        <Text style={{ color: cor }}>{categoria.tipo} - {categoria.nome}</Text>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.movimentacoesTitle}>Movimentações:</Text>
      <FlatList
        data={movimentacoes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePressMovimentacao(item)}>
            <View style={styles.movimentacaoItem}>
              <Text>Conta: {item.nomeConta}</Text>
              {renderCategoria(item.categoria, false) === 'transferencia' && (
                <Text>Conta Destino: {item.nomeContaDestino}</Text>
              )}
              <Text>Categoria: {renderCategoria(item.categoria, true)}</Text>
              <Text>Valor: {item.valor}</Text>
              <Text>Descrição: {item.descricao}</Text>
              <Text>Data da Movimentação: {item.movimentado_em}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  movimentacoesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  movimentacaoItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    width: '100%',
  },
});





// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
// import axios from 'axios';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';

// export default function Home({ route }) {
//   const { token, setValidationResult } = route.params;
//   const [validationResultLocal, setValidationResultLocal] = useState(null);
//   const [movimentacoes, setMovimentacoes] = useState([]);
//   const [categorias, setCategorias] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigation = useNavigation();

//   const handlePressMovimentacao = (movimentacao) => {
//     navigation.navigate('DetalharMovimentacoes', { movimentacao, token });
//   };

//   useEffect(() => {
//     const validateToken = async () => {
//       try {
//         const response = await axios.post('http://172.16.4.17:8000/api/Autenticacao/tokenvalidation', { token });
//         setValidationResultLocal(response.data);
//         setValidationResult(response.data); // Passando a resposta para o MainTabs
//       } catch (error) {
//         console.error('Error validating token:', error);
//         setValidationResultLocal({ error: 'Failed to validate token' });
//         setValidationResult({ error: 'Failed to validate token' }); // Passando um erro para o MainTabs
//         setError('Failed to validate token');
//       }
//     };

//     validateToken();
//   }, [token, setValidationResult]);

//   const fetchMovimentacoes = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`http://172.16.4.17:8000/api/Financa/GetFinancas/${validationResultLocal.id}/`, {
//         headers: {
//           Authorization: `Token ${token}`
//         }
//       });

//       const movimentacoesComDetalhes = await Promise.all(
//         response.data.movimentacoes.map(async (movimentacao) => {
//           const responseConta = await axios.get(`http://172.16.4.17:8000/api/Financa/conta/${movimentacao.conta}/`, {
//             headers: {
//               Authorization: `Token ${token}`
//             }
//           });

//           const detalhesMovimentacao = {
//             ...movimentacao,
//             nomeConta: responseConta.data.nome
//           };

//           if (movimentacao.conta_destino != null) {
//             console.log(movimentacao)
//             const responseContaDestino = await axios.get(`http://172.16.4.17:8000/api/Financa/conta/${movimentacao.conta_destino}/`, {
//               headers: {
//                 Authorization: `Token ${token}`
//               }
//             });

//             console.log(responseContaDestino)

//             detalhesMovimentacao.nomeContaDestino = responseContaDestino.data.nome;
//           }

//           return detalhesMovimentacao;
//         })
//       );

//       setMovimentacoes(movimentacoesComDetalhes);
//     } catch (error) {
//       console.error('Error fetching movimentacoes:', error);
//       setError('Error fetching movimentacoes');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCategorias = async () => {
//     try {
//       const responseCategorias = await axios.get('http://172.16.4.17:8000/api/Financa/categoria/', {
//         headers: {
//           Authorization: `Token ${token}`
//         }
//       });
//       setCategorias(responseCategorias.data);
//     } catch (error) {
//       console.error('Error fetching categorias:', error);
//       setError('Error fetching categorias');
//     }
//   };

//   useEffect(() => {
//     if (validationResultLocal && validationResultLocal.id) {

//       fetchMovimentacoes();
//       fetchCategorias();
    
//     }
//   }, [validationResultLocal, token]);
  

//   const getCorPorTipo = (tipo) => {
//     switch (tipo) {
//       case 'receita':
//         return '#32CD32';
//       case 'despesa':
//         return '#FF6347';
//       case 'transferencia':
//         return '#FFD700';
//       default:
//         return '#808080';
//     }
//   };

//   const renderCategoria = (categoriaId, tipo) => {
//     const categoria = categorias.find(cat => cat.id === categoriaId);

//     if (!tipo) {
//       return categoria.tipo;
//     }

//     if (categoria) {
//       const cor = getCorPorTipo(categoria.tipo);
//       return (
//         <Text style={{ color: cor }}>{categoria.tipo} - {categoria.nome}</Text>
//       );
//     }

//     return null;
//   };

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.container}>
//         <Text style={{ color: 'red' }}>{error}</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.movimentacoesTitle}>Movimentações:</Text>
//       <FlatList
//         data={movimentacoes}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <TouchableOpacity onPress={() => handlePressMovimentacao(item)}>
//             <View style={styles.movimentacaoItem}>
//             <Text>Conta: {item.nomeConta}</Text>
//             {renderCategoria(item.categoria, false) === 'transferencia' && (
//             <Text>Conta Destino: {item.nomeContaDestino}</Text>
//             )}
            
//               <Text>Categoria: {renderCategoria(item.categoria, true)}</Text>
//               <Text>Valor: {item.valor}</Text>
//               <Text>Descrição: {item.descricao}</Text>
//               <Text>Data da Movimentação: {item.movimentado_em}</Text>
             
//               {/* Preciso verificar se o retorno de  renderCategoria(item.categoria, false) é igual a transferencia*/}

//             </View>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     padding: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 24,
//   },
//   token: {
//     fontSize: 16,
//     color: 'gray',
//     marginBottom: 12,
//   },
//   result: {
//     fontSize: 16,
//     color: 'blue',
//     marginBottom: 24,
//   },
//   movimentacoesTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginTop: 24,
//     marginBottom: 12,
//   },
//   movimentacaoItem: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 12,
//     marginBottom: 12,
//     width: '100%',
//   },
// });

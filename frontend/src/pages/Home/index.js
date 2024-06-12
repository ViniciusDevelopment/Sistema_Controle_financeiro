// Home.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';

export default function Home({ route }) {
  const { token, setValidationResult } = route.params;
  const [validationResultLocal, setValidationResultLocal] = useState(null);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [categorias, setCategorias] = useState([]);

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
      }
    };

    const fetchMovimentacoes = async () => {
            try {
              const response = await axios.get('http://172.16.4.17:8000/api/Financa/movimentacao/', {
                headers: {
                  Authorization: `Token ${token}`
                }
              });
              // Mapear as movimentações para incluir o nome da conta
              const movimentacoesComNomeConta = await Promise.all(
                response.data.map(async (movimentacao) => {
                  // Buscar detalhes da conta usando o ID da conta
                  const responseConta = await axios.get(`http://172.16.4.17:8000/api/Financa/conta/${movimentacao.conta}/`, {
                    headers: {
                      Authorization: `Token ${token}`
                    }
                  });
                  // Retornar um objeto com o nome da conta e outros dados da movimentação
                  return {
                    ...movimentacao,
                    nomeConta: responseConta.data.nome
                  };
                })
              );
              setMovimentacoes(movimentacoesComNomeConta);
            } catch (error) {
              console.error('Error fetching movimentacoes:', error);
            }
          };

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
      }
    };

    validateToken();
    fetchMovimentacoes();
    fetchCategorias();
  }, [token, setValidationResult]);

  const getCorPorTipo = (tipo) => {
    // Definir cores para cada tipo de categoria
    switch (tipo) {
      case 'receita':
        return '#32CD32'; // Verde claro para receitas
      case 'despesa':
        return '#FF6347'; // Vermelho claro para despesas
      case 'transferencia':
        return '#FFD700'; // Amarelo para transferências
      default:
        return '#808080'; // Cinza para outros tipos (pode ser ajustado conforme necessário)
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


      <Text style={styles.movimentacoesTitle}>Movimentações:</Text>
      <FlatList
        data={movimentacoes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.movimentacaoItem}>
            <Text>Conta: {item.nomeConta}</Text>
            <Text>Categoria: {renderCategoria(item.categoria)}</Text>
            <Text>Valor: {item.valor}</Text>
            <Text>Descrição: {item.descricao}</Text>
            <Text>Data da Movimentação: {item.movimentado_em}</Text>
          </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  token: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 12,
  },
  result: {
    fontSize: 16,
    color: 'blue',
    marginBottom: 24,
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
// import { View, Text, StyleSheet, FlatList } from 'react-native';
// import axios from 'axios';

// export default function Home({ route }) {
//   const { token, setValidationResult } = route.params;
//   const [validationResultLocal, setValidationResultLocal] = useState(null);
//   const [movimentacoes, setMovimentacoes] = useState([]);

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
//       }
//     };

//     const fetchMovimentacoes = async () => {
//       try {
//         const response = await axios.get('http://172.16.4.17:8000/api/Financa/movimentacao/', {
//           headers: {
//             Authorization: `Token ${token}`
//           }
//         });
//         // Mapear as movimentações para incluir o nome da conta
//         const movimentacoesComNomeConta = await Promise.all(
//           response.data.map(async (movimentacao) => {
//             // Buscar detalhes da conta usando o ID da conta
//             const responseConta = await axios.get(`http://172.16.4.17:8000/api/Financa/conta/${movimentacao.conta}/`, {
//               headers: {
//                 Authorization: `Token ${token}`
//               }
//             });
//             // Retornar um objeto com o nome da conta e outros dados da movimentação
//             return {
//               ...movimentacao,
//               nomeConta: responseConta.data.nome
//             };
//           })
//         );
//         setMovimentacoes(movimentacoesComNomeConta);
//       } catch (error) {
//         console.error('Error fetching movimentacoes:', error);
//       }
//     };

//     validateToken();
//     fetchMovimentacoes();
//   }, [token, setValidationResult]);

//   return (
//     <View style={styles.container}>
//       {/* <Text style={styles.title}>Home Page</Text>
//       <Text style={styles.token}>Token: {token}</Text>
//       {validationResultLocal && (
//         <Text style={styles.result}>Validation Result: {JSON.stringify(validationResultLocal)}</Text>
//       )} */}

//       <Text style={styles.movimentacoesTitle}>Movimentações:</Text>
//       <FlatList
//         data={movimentacoes}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.movimentacaoItem}>
//             <Text>Conta: {item.nomeConta}</Text>
//             <Text>Categoria: {item.categoria}</Text>
//             <Text>Valor: {item.valor}</Text>
//             <Text>Descrição: {item.descricao}</Text>
//             <Text>Data da Movimentação: {item.movimentado_em}</Text>
//           </View>
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



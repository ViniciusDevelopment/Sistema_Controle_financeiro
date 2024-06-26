import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Button } from 'react-native';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { format } from 'date-fns';

export default function Home({ route }) {
  const { token, setValidationResult } = route.params;
  const [validationResultLocal, setValidationResultLocal] = useState(null);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState(1); // Estado para controlar a página atual
  const [hasMore, setHasMore] = useState(true); // Estado para indicar se há mais movimentações a carregar
  const [lastDisplayedDate, setLastDisplayedDate] = useState(null); // Estado para controlar a última data exibida
  const [dataFormatada, setdataFormatada] = useState(null); // Estado para controlar a última data exibida

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


  const fetchData = async () => {
    try {
      if (validationResultLocal && validationResultLocal.id) {
        setLoading(true);
        const responseMovimentacoes = await axios.get(`http://172.16.4.17:8000/api/Financa/GetMovimentacoesPaginadas/${validationResultLocal.id}/?page=${currentPage}`, {
          headers: {
            Authorization: `Token ${token}`
          }
        });

         // console.log(responseMovimentacoes.data.results)
         console.log(responseMovimentacoes.data.results)

        const movimentacoesComDetalhes = await Promise.all(
          responseMovimentacoes.data.results.map(async (movimentacao) => {
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

        setMovimentacoes([...movimentacoes, ...movimentacoesComDetalhes]);

        setHasMore(responseMovimentacoes.data.next !== null);

        console.log(movimentacoes)

        // Busca de categorias
        const responseCategorias = await axios.get('http://172.16.4.17:8000/api/Financa/categoria/', {
          headers: {
            Authorization: `Token ${token}`
          }
        });

        console.log("!!!!!")
        console.log(responseCategorias.data)
        setCategorias(responseCategorias.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };


  // Efeito para buscar movimentações e categorias ao focar na tela
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          if (validationResultLocal && validationResultLocal.id) {
            setLoading(true);
            const responseMovimentacoes = await axios.get(`http://172.16.4.17:8000/api/Financa/GetMovimentacoesPaginadas/${validationResultLocal.id}/?page=${currentPage}`, {
              headers: {
                Authorization: `Token ${token}`
              }
            });

             // console.log(responseMovimentacoes.data.results)
             console.log(responseMovimentacoes.data.results)

            const movimentacoesComDetalhes = await Promise.all(
              responseMovimentacoes.data.results.map(async (movimentacao) => {
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

            setMovimentacoes([...movimentacoes, ...movimentacoesComDetalhes]);

            setHasMore(responseMovimentacoes.data.next !== null);

            console.log(movimentacoes)

            // Busca de categorias
            const responseCategorias = await axios.get('http://172.16.4.17:8000/api/Financa/categoria/', {
              headers: {
                Authorization: `Token ${token}`
              }
            });

            console.log("!!!!!")
            console.log(responseCategorias.data)
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

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setCurrentPage(currentPage + 1);
      fetchData();
    }
  };

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

  const formatarDataBrasileira = (dataISO) => {
    const data = new Date(dataISO);
    return format(data, "dd/MM/yyyy");
  };

  const formatarDataPorExtenso = (dataISO) => {
    const data = new Date(dataISO);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return data.toLocaleDateString('pt-BR', options);
  };


  return (
    <View style={styles.container}>
      <Text style={styles.movimentacoesTitle}>Movimentações:</Text>
      <FlatList
        data={movimentacoes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => {
          const dataFormatada = formatarDataBrasileira(item.movimentado_em);

          // Verifica se a data do item é diferente da última exibida
          const renderDateHeader = dataFormatada !== lastDisplayedDate ? (
            <View style={styles.dataContainer}>
              <Text style={styles.dataTitle}>{formatarDataPorExtenso(item.movimentado_em)}</Text>
            </View>
          ) : null;

          // Atualiza a última data exibida
          setLastDisplayedDate(dataFormatada);

          return (
            <>
              {renderDateHeader}
              <TouchableOpacity onPress={() => handlePressMovimentacao(item)}>
                <View style={styles.movimentacaoItem}>
                  <Text>Conta: {item.nomeConta}</Text>
                  {renderCategoria(item.categoria, false) === 'transferencia' && (
                    <Text>Conta Destino: {item.nomeContaDestino}</Text>
                  )}
                  <Text>Categoria: {renderCategoria(item.categoria, true)}</Text>
                  <Text>Valor: {item.valor}</Text>
                  <Text>Descrição: {item.descricao}</Text>
                  <Text>Data da Movimentação: {formatarDataBrasileira(item.movimentado_em)}</Text>
                </View>
              </TouchableOpacity>
            </>
          );
        }}
        ListFooterComponent={() => (
          <View style={styles.loadMoreButton}>
            <Button title="Carregar mais" onPress={handleLoadMore} disabled={loading || !hasMore} />
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



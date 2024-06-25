import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Platform,
} from "react-native";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

export default function DetalharMovimentacoes({ route, navigation }) {
  const { token } = route.params;
  const { movimentacao } = route.params;
  const [validationResultLocal, setValidationResultLocal] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [categorias2, setCategorias2] = useState([]);
  const [modalVisibleDelete, setModalVisibleDelete] = useState(false);
  const [modalVisibleEdit, setModalVisibleEdit] = useState(false);

  const [novoNomeMovimentacao, setNovoNomeMovimentacao] = useState(movimentacao.descricao);
  const [novoValorMovimentacao, setNovoValorMovimentacao] = useState(movimentacao.valor.toString());
  const [novaDataMovimentacao, setNovaDataMovimentacao] = useState(new Date(movimentacao.movimentado_em));
  const [novaContaOrigem, setNovaContaOrigem] = useState(movimentacao.conta);
  const [novaContaDestino, setNovaContaDestino] = useState(movimentacao.conta_destino || "");
  const [novaCategoria, setNovaCategoria] = useState(movimentacao.categoria.toString());
  
  const [error, setError] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [contas, setContas] = useState([]);
  const [contaSelecionada, setContaSelecionada] = useState("");
  const [tipoMovimentacao, setTipoMovimentacao] = useState("receita");
  const [showContaDestino, setShowContaDestino] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await axios.post(
          "http://172.16.4.17:8000/api/Autenticacao/tokenvalidation",
          { token }
        );
        setValidationResultLocal(response.data);
      } catch (error) {
        console.error("Error validating token:", error);
        setValidationResultLocal({ error: "Failed to validate token" });
        setError("Failed to validate token");
      }
    };

    validateToken();
  }, [token, setValidationResultLocal]);

  useEffect(() => {
  const fetchContas = async () => {
    try {
      if (validationResultLocal && validationResultLocal.id) {
        const response = await axios.get(
          `http://172.16.4.17:8000/api/Financa/GetFinancas/${validationResultLocal.id}/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        setContas(response.data.contas);
      }
    } catch (error) {
      console.error("Erro ao carregar contas:", error);
    }
  };

  fetchContas();
}, [validationResultLocal, token]);


  useEffect(() => {
    if (validationResultLocal && validationResultLocal.id) {
      const fetchCategorias = async () => {
        try {
          if (validationResultLocal) {
            const response = await axios.get(
              `http://172.16.4.17:8000/api/Financa/GetCategoriaTipo/${validationResultLocal.id}/${tipoMovimentacao}/`,
              {
                headers: {
                  Authorization: `Token ${token}`,
                },
              }
            );
            console.log(response.data);
            setCategorias(response.data);
          }
        } catch (error) {
          console.error("Erro ao carregar categorias:", error);
        }
      };

      fetchCategorias();
    }
  }, [tipoMovimentacao, token, validationResultLocal]);

  useEffect(() => {
    if (validationResultLocal && validationResultLocal.id) {
      const fetchCategorias2 = async () => {
        try {
          const responseCategorias = await axios.get(
            "http://172.16.4.17:8000/api/Financa/categoria/",
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );
          console.log("GGGGGG");
          console.log(responseCategorias.data);
          setCategorias2(responseCategorias.data);
        } catch (error) {
          console.error("Error fetching categorias:", error);
          setError("Error fetching categorias");
        }
      };

      fetchCategorias2();
    }
  }, [validationResultLocal, token]);

  const getCorPorTipo = (tipo) => {
    switch (tipo) {
      case "receita":
        return "#32CD32";
      case "despesa":
        return "#FF6347";
      case "transferencia":
        return "#FFD700";
      default:
        return "#808080";
    }
  };

  const renderCategoria = (categoriaId) => {
    const categoria = categorias2.find(
      (cat) => cat.id === parseInt(categoriaId)
    );
    if (categoria) {
      const cor = getCorPorTipo(categoria.tipo);
      return <Text style={{ color: cor }}>{categoria.nome}</Text>;
    }
    return null;
  };

  useEffect(() => {
    if (movimentacao.categoria && categorias2.length > 0) {
      const categoria = categorias2.find(
        (cat) => cat.id === parseInt(movimentacao.categoria)
      );
      if (categoria) {
        setTipoMovimentacao(categoria.tipo);
      }
    }
  }, [movimentacao.categoria, categorias2]);

  const handleDeleteMovimentacao = async () => {
    try {
      await axios.delete(
        `http://172.16.4.17:8000/api/Financa/movimentacao/${movimentacao.id}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      navigation.goBack(); // Voltar para a tela anterior após a exclusão
    } catch (error) {
      console.error("Error deleting movimentacao:", error);
      setError("Error deleting movimentacao");
    }
  };

  const handleEditMovimentacao = async () => {

      if (!movimentacaoEditando || novoNomeMovimentacao === '') {
        return;
      }
  
      const url = `http://172.16.4.17:8000/api/Financa/movimentacao/${movimentacao.id}/`;
  
      const requestBody = {
        user: validationResultLocal.id, // Substitua com o ID do usuário correto
        nome: novoNomeCategoria,
        tipo: novoTipoCategoria,
      };
  
      // Aqui você faria a requisição PUT usando fetch ou axios
      fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(requestBody),
      })
        .then(response => {
          if (response.ok) {
            // Aqui você pode adicionar lógica adicional após a atualização bem-sucedida
            console.log('movimentação atualizada com sucesso!');
            fetchMovimentacao();
            fecharModalEdicao();
          } else {
            console.error('Falha ao atualizar categoria:', response.status);
          }
        })
        .catch(error => {
          console.error('Erro ao atualizar categoria:', error);
        });
    };
  

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || novaDataMovimentacao;
    setShowDatePicker(false);
    setNovaDataMovimentacao(currentDate);
  };

  const handleTipoMovimentacao = (tipo) => {
    setTipoMovimentacao(tipo);
    setShowContaDestino(tipo === "transferencia");
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
      <Text style={styles.value}>
        {renderCategoria(movimentacao.categoria)}
      </Text>

      <Text style={styles.label}>Valor:</Text>
      <Text style={styles.value}>{movimentacao.valor}</Text>

      <Text style={styles.label}>Descrição:</Text>
      <Text style={styles.value}>{movimentacao.descricao}</Text>

      <TouchableOpacity
        style={[styles.button, styles.editButton]}
        onPress={() => setModalVisibleEdit(true)}
      >
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
            <View style={styles.opcoesContainer}>
              <TouchableOpacity
                style={[
                  styles.opcaoButton,
                  tipoMovimentacao === "receita"
                    ? styles.opcaoButtonSelected
                    : null,
                ]}
                onPress={() => handleTipoMovimentacao("receita")}
              >
                <Text
                  style={[
                    styles.opcaoText,
                    tipoMovimentacao === "receita"
                      ? styles.opcaoTextSelected
                      : null,
                  ]}
                >
                  Receita
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.opcaoButton,
                  tipoMovimentacao === "despesa"
                    ? styles.opcaoButtonSelected
                    : null,
                ]}
                onPress={() => handleTipoMovimentacao("despesa")}
              >
                <Text
                  style={[
                    styles.opcaoText,
                    tipoMovimentacao === "despesa"
                      ? styles.opcaoTextSelected
                      : null,
                  ]}
                >
                  Despesa
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.opcaoButton,
                  tipoMovimentacao === "transferencia"
                    ? styles.opcaoButtonSelected
                    : null,
                ]}
                onPress={() => handleTipoMovimentacao("transferencia")}
              >
                <Text
                  style={[
                    styles.opcaoText,
                    tipoMovimentacao === "transferencia"
                      ? styles.opcaoTextSelected
                      : null,
                  ]}
                >
                  Transferência
                </Text>
              </TouchableOpacity>
            </View>

            {/* Descrição da movimentação */}
            <Text style={styles.label}>Descrição da Movimentação:</Text>
            <TextInput
              style={styles.input}
              value={novoNomeMovimentacao}
              onChangeText={setNovoNomeMovimentacao}
              placeholder="Descrição da movimentação"
            />

            {/* Valor da movimentação */}
            <Text style={styles.label}>Valor da Movimentação:</Text>
            <TextInput
              style={styles.input}
              value={novoValorMovimentacao}
              onChangeText={setNovoValorMovimentacao}
              placeholder="Valor da movimentação"
              keyboardType="numeric"
            />

            {/* Data da movimentação */}

            <Text style={styles.label}>Data da Movimentação:</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                style={styles.input}
                value={novaDataMovimentacao.toDateString()}
                editable={false}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={novaDataMovimentacao}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  setNovaDataMovimentacao(selectedDate || novaDataMovimentacao);
                }}
              />
            )}

            {/* Conta de Origem */}
            <Text style={styles.label}>Conta de Origem:</Text>
            {/* <View style={{ flex: 1, padding: 0, margin: 0 }}> */}
            <Picker
        selectedValue={novaContaOrigem}
        onValueChange={(itemValue, itemIndex) => setNovaContaOrigem(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione uma conta" value="" />
        {contas.map(conta => (
          <Picker.Item key={conta.id} label={conta.nome} value={conta.id} />
        ))}
      </Picker>
      {/* </View> */}
            {/* <Picker
              selectedValue={novaContaOrigem}
              onValueChange={(itemValue, itemIndex) =>
                setNovaContaOrigem(itemValue)
              }
            >
              {contas.map((conta) => (
                <Picker.Item
                  key={conta.id}
                  label={conta.nome}
                  value={conta.id}
                />
              ))}
            </Picker> */}

            {showContaDestino && (
              <>
                <Text style={styles.label}>Conta Destino:</Text>
                <Picker
                  selectedValue={novaContaDestino}
                  onValueChange={(itemValue, itemIndex) =>
                    setNovaContaDestino(itemValue)
                  }
                  style={styles.picker}
                >
                  {/* Renderizar as opções de contas destino disponíveis */}
                  {contas.map((conta) => (
                    <Picker.Item
                      key={conta.id}
                      label={conta.nome}
                      value={conta.id}
                    />
                  ))}
                </Picker>
              </>
            )}

            {/* Categoria */}
            <Text style={styles.label}>Categoria:</Text>

            <Picker
              selectedValue={novaCategoria}
              onValueChange={(itemValue, itemIndex) =>
                setNovaCategoria(itemValue)
              }
              style={styles.picker}
            >
              <Picker.Item label="Selecione uma categoria" value="" />
              {categorias.map((categoria) => (
                <Picker.Item
                  key={categoria.id}
                  label={categoria.nome}
                  value={categoria.id}
                />
              ))}
            </Picker>

              {/* Botões de Ação no Modal */}
      <View style={styles.modalButtons}>
        <TouchableOpacity
          onPress={() => setModalVisibleEdit(false)}
          style={[styles.button, styles.cancelButton]}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleEditMovimentacao}
          style={[styles.button, styles.saveButton]}
        >
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
  itemStyle: {
    fontSize: 15,
    height: 75,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  picker: {
    width: 100
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  value: {
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "red",
  },
  editButton: {
    backgroundColor: "green",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  modalContent: {
    width: "90%",
    height: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalButtons: {
    backgroundColor: "#000",
    color: "red",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    width: "100%",
  },
  input: {
    width: "100%",
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
  },
  opcoesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  opcaoButton: {
    flex: 1,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: "#fff",
  },
  opcaoButtonSelected: {
    backgroundColor: "#007AFF",
  },
  opcaoText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  opcaoTextSelected: {
    color: "#fff",
  },
});

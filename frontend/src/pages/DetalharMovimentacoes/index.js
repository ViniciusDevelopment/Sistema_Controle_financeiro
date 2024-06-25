import React, { useState, useEffect, useCallback } from "react";
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
import { useNavigation } from "@react-navigation/native";

export default function DetalharMovimentacoes({ route, navigation }) {
  const { token } = route.params;
  // const { movimentacao } = route.params;
  const [movimentacao, setMovimentacao] = useState(route.params.movimentacao);
  const navigationroute = useNavigation();
  const [validationResultLocal, setValidationResultLocal] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [categorias2, setCategorias2] = useState([]);
  const [modalVisibleDelete, setModalVisibleDelete] = useState(false);
  const [modalVisibleEdit, setModalVisibleEdit] = useState(false);

  const [novoNomeMovimentacao, setNovoNomeMovimentacao] = useState(
    movimentacao.descricao
  );
  const [novoValorMovimentacao, setNovoValorMovimentacao] = useState(
    movimentacao.valor.toString()
  );
  const [novaDataMovimentacao, setNovaDataMovimentacao] = useState(
    new Date(movimentacao.movimentado_em)
  );
  const [novaContaOrigem, setNovaContaOrigem] = useState(movimentacao.conta);
  const [novaContaDestino, setNovaContaDestino] = useState(
    movimentacao.conta_destino || ""
  );
  const [novaCategoria, setNovaCategoria] = useState(
    movimentacao.categoria.toString()
  );

  const [errors, setErrors] = useState({
    nomeMovimentacao: false,
    valorMovimentacao: false,
    dataMovimentacao: false,
    contaOrigem: false,
    categoria: false,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [contas, setContas] = useState([]);
  const [contaSelecionada, setContaSelecionada] = useState("");
  const [tipo, setTipo] = useState("");
  const [tipoMovimentacao, setTipoMovimentacao] = useState("receita");
  const [showContaDestino, setShowContaDestino] = useState(false);

  
  const fetchMovimentacaoById = async (movimentacaoId) => {
    try {
      console.log(movimentacaoId)
      
      const response = await axios.get(`http://172.16.4.17:8000/api/Financa/movimentacao/${movimentacaoId}/`, {
        headers: {
          Authorization: `Token ${token}`
        }
      });
  
      const movimentacao = response.data;
  
      // Busca detalhes da conta associada
      const responseConta = await axios.get(`http://172.16.4.17:8000/api/Financa/conta/${movimentacao.conta}/`, {
        headers: {
          Authorization: `Token ${token}`
        }
      });
  
      const detalhesMovimentacao = {
        ...movimentacao,
        nomeConta: responseConta.data.nome
      };
  
      // Se houver conta de destino, busca detalhes da conta destino
      if (movimentacao.conta_destino != null) {
        const responseContaDestino = await axios.get(`http://172.16.4.17:8000/api/Financa/conta/${movimentacao.conta_destino}/`, {
          headers: {
            Authorization: `Token ${token}`
          }
        });
  
        detalhesMovimentacao.nomeContaDestino = responseContaDestino.data.nome;
      }
  
      setMovimentacao(detalhesMovimentacao);
  
    } catch (error) {
      console.error('Error fetching movimentacao:', error);
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
      setError('Error fetching categorias');
    }
  };




  const validateFields = () => {
    let formIsValid = true;
    const newErrors = {
      nomeMovimentacao: false,
      valorMovimentacao: false,
      dataMovimentacao: false,
      contaOrigem: false,
      contaDestino: false,
      categoria: false,
    };

    if (!novoNomeMovimentacao.trim()) {
      formIsValid = false;
      newErrors.nomeMovimentacao = true;
    }

    if (!novoValorMovimentacao.trim()) {
      formIsValid = false;
      newErrors.valorMovimentacao = true;
    }

    if (!novaDataMovimentacao) {
      formIsValid = false;
      newErrors.dataMovimentacao = true;
    }

    if (!novaContaOrigem) {
      formIsValid = false;
      newErrors.contaOrigem = true;
    }
    if (tipoMovimentacao == "transferencia") {
      if (!novaContaDestino) {
        formIsValid = false;
        newErrors.contaDestino = true;
      }
    }

    if (!novaCategoria) {
      formIsValid = false;
      newErrors.categoria = true;
    }

    setErrors(newErrors);

    return formIsValid;
  };

  const fecharModalDelete = () => {
    setModalVisibleDelete(false);
  };

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

  useEffect(() => {
    if (movimentacao.categoria && categorias2.length > 0) {
      const categoria = categorias2.find(
        (cat) => cat.id === parseInt(movimentacao.categoria)
      );
      if (categoria) {
        setTipo(categoria.tipo);
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
      alert("Movimentação deletada com sucesso!");
      onPressVoltar();
    } catch (error) {
      console.error("Error deleting movimentacao:", error);
    }
  };

  const handleEditMovimentacao = async () => {
    if (validateFields()) {
      const url = `http://172.16.4.17:8000/api/Financa/AlterarMovimentacao/${movimentacao.id}/`;

      const requestBody = {
        descricao: novoNomeMovimentacao,
        valor: parseFloat(novoValorMovimentacao),
        movimentado_em: novaDataMovimentacao.toISOString().split("T")[0], // Formata a data para o formato adequado
        conta: novaContaOrigem,
        conta_destino: novaContaDestino !== "" ? novaContaDestino : null,
        categoria: parseInt(novaCategoria),
      };

      if (tipoMovimentacao != "transferencia") {
        requestBody.conta_destino = null;
      }

      console.log(requestBody);

      // Aqui você faria a requisição PUT usando fetch ou axios
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();
      const cleanedResponse = responseData.replace(/[,.\[\]{}'""\""]/g, "");

      alert(JSON.stringify(cleanedResponse));
      fetchMovimentacaoById(movimentacao.id);
      setModalVisibleEdit(false);
    } else {
      console.log("Por favor, preencha todos os campos obrigatórios!");
    }
  };

  const handleTipoMovimentacao = (tipo_recebido) => {
    if (tipo !== tipo_recebido) {
      setTipoMovimentacao(tipo_recebido);
      setShowContaDestino(tipo_recebido === "transferencia");
      setNovaCategoria(""); // Reseta a categoria quando o tipo de movimentação muda
    } else {
      setTipoMovimentacao(tipo_recebido);
      setShowContaDestino(tipo_recebido === "transferencia");
      setNovaCategoria(tipo);
    }
  };

  const onPressVoltar = useCallback(() => {
    navigation.navigate("Home", { token });
    navigation.reset({
      index: 0,
      routes: [{ name: "Home", params: { token } }],
    });
  }, [navigation, token]);

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

      <Text style={styles.label}>Data:</Text>
      <Text style={styles.value}>{movimentacao.movimentado_em}</Text>

      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => setModalVisibleEdit(true)}
        >
          <Text style={styles.buttonText}>Alterar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => setModalVisibleDelete(true)}
        >
          <Text style={styles.buttonText}>Deletar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.lastButton]}
          onPress={onPressVoltar}
        >
          <Text style={styles.buttonText}>Voltar para Home</Text>
        </TouchableOpacity>
      </View>

      {/*Modal Delete*/}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleDelete}
        onRequestClose={() => setModalVisibleDelete(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Excluir Movimentação</Text>
            <Text>Tem certeza que deseja deletar a movimentação?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={fecharModalDelete} style={[styles.button, { backgroundColor: 'red' }]}>
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
              style={[
                styles.input,
                errors.nomeMovimentacao && styles.errorInput,
              ]}
              value={novoNomeMovimentacao}
              onChangeText={setNovoNomeMovimentacao}
              placeholder="Descrição da movimentação"
            />

            {/* Valor da movimentação */}
            <Text style={styles.label}>Valor da Movimentação:</Text>
            <TextInput
              style={[
                styles.input,
                errors.valorMovimentacao && styles.errorInput,
              ]}
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

            {errors.dataMovimentacao && (
              <Text style={styles.errorText}>Selecione uma data</Text>
            )}

            {/* Conta de Origem */}
            <Text style={styles.label}>Conta de Origem:</Text>

            <Picker
              selectedValue={novaContaOrigem}
              onValueChange={(itemValue, itemIndex) =>
                setNovaContaOrigem(itemValue)
              }
              style={[styles.picker, errors.contaOrigem && styles.errorPicker]}
            >
              <Picker.Item label="Selecione uma conta" value="" />
              {contas.map((conta) => (
                <Picker.Item
                  key={conta.id}
                  label={conta.nome}
                  value={conta.id}
                />
              ))}
            </Picker>

            {showContaDestino && (
              <>
                <Text style={styles.label}>Conta Destino:</Text>
                <Picker
                  selectedValue={novaContaDestino}
                  onValueChange={(itemValue, itemIndex) =>
                    setNovaContaDestino(itemValue)
                  }
                  style={[
                    styles.picker,
                    errors.contaDestino && styles.errorPicker,
                  ]}
                >
                  <Picker.Item label="Selecione uma conta" value="" />
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
              style={[styles.picker, errors.categoria && styles.errorPicker]}
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
                style={[styles.button2, styles.cancelButton]}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleEditMovimentacao}
                style={[styles.button2, styles.saveButton]}
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
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
  },
  picker: {
    width: 100,
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
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    width: "100%",
    height: 40,
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: "#f1c40f",
  },
  lastButton: {
    backgroundColor: "#3498db",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
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
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    width: "100%",
  },
  button2: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  cancelButton: {
    backgroundColor: "#e74c3c",
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: "#2ecc71",
    marginLeft: 10,
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
  errorInput: {
    borderColor: "red",
    borderWidth: 2,
  },

  errorPicker: {
    borderColor: "red",
    borderWidth: 2,
    borderRadius: 5,
  },

  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});

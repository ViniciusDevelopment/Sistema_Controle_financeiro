import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  FlatList,
  Modal,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

export default function Contas({ route, navigation }) {
  const { token, setValidationResult } = route.params;
  const [validationResultLocal, setValidationResultLocal] = useState(null);
  const [nomeConta, setNomeConta] = useState("");
  const [contas, setContas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [novoNomeConta, setNovoNomeConta] = useState('');
  const [contaEditando, setContaEditando] = useState(null);

  const abrirModalEdicao = (conta) => {
    setContaEditando(conta);
    setNovoNomeConta(conta.nome);
    setModalVisible2(true);
  };

  const fecharModalEdicao = () => {
    setModalVisible2(false);
    setContaEditando(null);
    setNovoNomeConta('');
  };

  const abrirModalDelete = (conta) => {
    setContaEditando(conta);
    setModalVisible3(true);
  };

  const fecharModalDelete = () => {
    setModalVisible3(false);
    setContaEditando(null);
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
      }
    };

    validateToken();
  }, [token, setValidationResultLocal]);

  const fetchContas = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Token ${token}`,
        },
      };

      const response = await axios.get(
        `http://172.16.4.17:8000/api/Financa/GetFinancas/${validationResultLocal.id}/`,
        config
      );

      const contasComSaldoFormatado = response.data.contas.map((conta) => ({
        ...conta,
        saldoFormatado: formatarSaldo(conta.saldo),
      }));

      setContas(contasComSaldoFormatado);
    } catch (error) {
      console.error("Erro ao buscar contas:", error);
      Alert.alert("Erro", "Falha ao buscar contas");
    }
  };


  useEffect(() => {
    const fetchContas = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Token ${token}`,
          },
        };

        const response = await axios.get(
          `http://172.16.4.17:8000/api/Financa/GetFinancas/${validationResultLocal.id}/`,
          config
        );

        const contasComSaldoFormatado = response.data.contas.map((conta) => ({
          ...conta,
          saldoFormatado: formatarSaldo(conta.saldo),
        }));

        setContas(contasComSaldoFormatado);
      } catch (error) {
        console.error("Erro ao buscar contas:", error);
        Alert.alert("Erro", "Falha ao buscar contas");
      }
    };

    if (validationResultLocal && validationResultLocal.id) {
      fetchContas();
    }
  }, [token, validationResultLocal]);

  const formatarSaldo = (saldo) => {
    const saldoNumerico = parseFloat(saldo);
    const saldoFormatado = saldoNumerico.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    let corTexto = "black";
    if (saldoNumerico < 0) {
      corTexto = "red";
    } else if (saldoNumerico > 0) {
      corTexto = "green";
    }

    return saldoFormatado;
  };

  const cadastrarConta = async () => {

    if (nomeConta.trim() === "") {
      alert("O campo Nome da Conta é obrigatório.");
      return;
    }
 
      try {
        const config = {
          headers: {
            Authorization: `Token ${token}`,
          },
        };
  
        const response = await axios.post(
          "http://172.16.4.17:8000/api/Financa/conta/",
          { user: validationResultLocal.id, nome: nomeConta },
          config
        );
  
        Alert.alert("Sucesso", "Conta cadastrada com sucesso!");
        setNomeConta("");
        setModalVisible(false);
        fetchContas();
      } catch (error) {
        console.error("Erro ao cadastrar conta:", error);
        Alert.alert("Erro", "Falha ao cadastrar conta");
      }
    
  };


  const handleAtualizarConta = async () => {
    // Aqui você deve fazer a requisição PUT para atualizar a conta

    if (novoNomeConta.trim() === "") {
      alert("O campo Nome da Conta é obrigatório.");
      return;
    }

    if (!contaEditando || novoNomeConta === '') {
      return; // Verificação básica para garantir que tenha uma conta selecionada e um novo nome preenchido
    }

    const url = `http://172.16.4.17:8000/api/Financa/conta/${contaEditando.id}/`;

    const requestBody = {
      user: validationResultLocal.id, // Substitua com o ID do usuário correto
      nome: novoNomeConta,
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
          console.log('Conta atualizada com sucesso!');
          fetchContas();
          fecharModalEdicao();
        } else {
          console.error('Falha ao atualizar conta:', response.status);
        }
      })
      .catch(error => {
        console.error('Erro ao atualizar conta:', error);
      });
  };

  const handleDeletarConta = async () => {

    const url = `http://172.16.4.17:8000/api/Financa/conta/${contaEditando.id}/`;

    // Aqui você faria a requisição PUT usando fetch ou axios
    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    })
      .then(response => {
        if (response.ok) {
          // Aqui você pode adicionar lógica adicional após a atualização bem-sucedida
          console.log('Conta deletada com sucesso!');
          fetchContas();
          fecharModalDelete();
        } else {
          console.error('Falha ao deletar conta:', response.status);
          alert('A conta possui uma movimentação: Não é possível deletar a conta')
        }
      })
      .catch(error => {
        console.error('A conta possui uma movimentação:', " Não é possível deletar a conta");
      });
  };

  return (
    <View style={styles.container}>
      <View style={{ width: 50 }}></View>
      <View
        style={[
          styles.appBar,
          {height: 80},
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="chevron-left"
            size={24}
            color="#fff"
            style={styles.backButtonIcon}
          />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Contas</Text>
        <View style={{ width: 50 }}></View>
      </View>

      <FlatList
      data={contas}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.contaItem}>
          <Text>{item.nome}</Text>
          <Text
            style={{
              fontWeight: 'bold',
              color: item.saldo < 0 ? 'red' : item.saldo > 0 ? 'green' : 'black',
            }}
          >
            {formatarSaldo(item.saldo)}
          </Text>
          {/* Ícone de Edição */}
          <FontAwesome5Icon
            name="edit"
            size={20}
            color="blue"
            style={{ marginLeft: 10 }}
            onPress={() => {
              console.log('Editar item:', item.id);
              abrirModalEdicao(item);

            }}
          />
          {/* Ícone de Exclusão */}
          <FontAwesome5Icon
            name="trash"
            size={20}
            color="red"
            style={{ marginLeft: 10 }}
            onPress={() => {
              console.log('Editar item:', item.id);
              abrirModalDelete(item);
            }}
          />
        </View>
      )}
    />

<Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={fecharModalEdicao}
      >
        <View style={styles.modalcategoriainer}>
          <View style={styles.modalView}>
            <Text>Editar Conta</Text>
            <Text style={styles.label}>Nome:</Text>
            <TextInput
               style={[
                styles.input
              ]}
              value={novoNomeConta}
              onChangeText={setNovoNomeConta}
              placeholder="Digite o nome da conta"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={fecharModalEdicao}
                style={[styles.button2, styles.cancelButton]}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAtualizarConta}
                style={[styles.button2, styles.saveButton]}
              >
                <Text style={styles.buttonText}>Alterar</Text>
              </TouchableOpacity>
            </View>
            
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible3}
        onRequestClose={fecharModalDelete}
      >
        <View style={styles.modalcategoriainer}>
          <View style={styles.modalView}>
          <Text>Deletar Conta</Text>
            <Text>Tem certeza que deseja deletar a conta {contaEditando?.nome}?</Text>
            

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={fecharModalDelete}
                style={[styles.button2, styles.cancelButton]}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDeletarConta}
                style={[styles.button2, styles.saveButton]}
              >
                <Text style={styles.buttonText}>Deletar</Text>
              </TouchableOpacity>
            </View>
            
          </View>
        </View>
      </Modal>


      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Adicionar Conta</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.label}>Nome da Conta:</Text>
            <TextInput
               style={[
                styles.input
              ]}
              value={nomeConta}
              onChangeText={setNomeConta}
              placeholder="Digite o nome da conta"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.button2, styles.cancelButton]}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={cadastrarConta}
                style={[styles.button2, styles.saveButton]}
              >
                <Text style={styles.buttonText}>Cadastrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );

}

const styles = StyleSheet.create({
  modalcategoriainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#007BFF",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    color: "#fff",
    fontSize: 16,
  },
  appBarTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  contaItem: {
    padding: 16,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  


  picker: {
    width: 100,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  addButton: {
    backgroundColor: "#007BFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
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

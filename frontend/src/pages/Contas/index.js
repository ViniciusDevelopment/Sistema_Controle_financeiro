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
          alert('Falha ao deletar conta:', response.status)
        }
      })
      .catch(error => {
        console.error('Erro ao deletar conta:', error);
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
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Editar Conta</Text>
            <TextInput
              style={styles.input}
              value={novoNomeConta}
              onChangeText={setNovoNomeConta}
              placeholder="Novo nome da conta"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={fecharModalEdicao} style={[styles.button, { backgroundColor: 'red' }]}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAtualizarConta} style={[styles.button, { backgroundColor: 'green' }]}>
                <Text style={styles.buttonText}>Salvar</Text>
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
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Deletar Conta</Text>
            <Text>Tem certeza que deseja deletar a conta {contaEditando?.nome}?</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={fecharModalDelete} style={[styles.button, { backgroundColor: 'red' }]}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeletarConta} style={[styles.button, { backgroundColor: 'green' }]}>
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
              style={styles.input}
              value={nomeConta}
              onChangeText={setNomeConta}
              placeholder="Digite o nome da conta"
            />
            <Button title="Cadastrar Conta" onPress={cadastrarConta} />
            <Button
              title="Cancelar"
              onPress={() => setModalVisible(false)}
              color="red"
            />
          </View>
        </View>
      </Modal>
    </View>
  );

}

const styles = StyleSheet.create({
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
  addButton: {
    backgroundColor: "#007BFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

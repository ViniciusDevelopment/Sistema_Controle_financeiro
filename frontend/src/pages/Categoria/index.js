// categorias.js

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
import { Picker } from '@react-native-picker/picker';

export default function Categoria({ route, navigation }) {
  const { token, validationResult } = route.params;
  const [validationResultLocal, setValidationResultLocal] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('receita');
  const [novoNomeCategoria, setNovoNomeCategoria] = useState('');
  const [novoTipoCategoria, setNovoTipoCategoria] = useState('');
  const [categoriaEditando, setCategoriaEditando] = useState(null);

  const abrirModalEdicao = (categoria) => {
    setCategoriaEditando(categoria);
    setNovoNomeCategoria(categoria.nome);
    setNovoTipoCategoria(categoria.tipo);
    setModalVisible2(true);
  };

  const fecharModalEdicao = () => {
    setModalVisible2(false);
    setCategoriaEditando(null);
    setNovoNomeCategoria('');
  };

  const abrirModalDelete = (categoria) => {
    setCategoriaEditando(categoria);
    setModalVisible3(true);
  };

  const fecharModalDelete = () => {
    setModalVisible3(false);
    setCategoriaEditando(null);
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

  const fetchCategorias = async () => {
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

      const categorias = response.data.categorias.map((categorias) => ({
        ...categorias,
      }));
      console.log(categorias)
      setCategorias(categorias);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      Alert.alert("Erro", "Falha ao buscar categorias");
    }
  };

  const handleAtualizarCategoria = async () => {
    // Aqui você deve fazer a requisição PUT para atualizar a categoria
    if (!categoriaEditando || novoNomeCategoria === '') {
      return; // Verificação básica para garantir que tenha uma categoria selecionada e um novo nome preenchido
    }

    const url = `http://172.16.4.17:8000/api/Financa/categoria/${categoriaEditando.id}/`;

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
          console.log('categoria atualizada com sucesso!');
          fetchCategorias();
          fecharModalEdicao();
        } else {
          console.error('Falha ao atualizar categoria:', response.status);
        }
      })
      .catch(error => {
        console.error('Erro ao atualizar categoria:', error);
      });
  };


  const handleDeletarCategoria = async () => {

    const url = `http://172.16.4.17:8000/api/Financa/categoria/${categoriaEditando.id}/`;

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
          console.log('Categoria deletada com sucesso!');
          fetchCategorias();
          fecharModalDelete();
        } else {
          console.error('Falha ao deletar categoria:', response.status);
          alert('Falha ao deletar categoria:', response.status)
        }
      })
      .catch(error => {
        console.error('Erro ao deletar categoria:', error);
      });
  };

  useEffect(() => {
    const fetchCategorias = async () => {
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
  
        const categorias = response.data.categorias.map((categorias) => ({
          ...categorias,
        }));
        console.log(categorias)
        setCategorias(categorias);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        Alert.alert("Erro", "Falha ao buscar categorias");
      }
    };

    if (validationResultLocal && validationResultLocal.id) {
      fetchCategorias();
    }
  }, [token, validationResultLocal]);

  const cadastrarCategoria = async () => {
    try {
      console.log(validationResult)
      const config = {
        headers: {
          Authorization: `Token ${token}` // Inclui o token no cabeçalho da requisição
        }
      };

      const response = await axios.post(
        'http://172.16.4.17:8000/api/Financa/categoria/',
        { user: validationResultLocal.id, tipo: tipo, nome: nome },
        config
      );
      fetchCategorias();
      setModalVisible(false);
      Alert.alert('Sucesso', 'categoria cadastrada com sucesso!');
      setNome('');
    } catch (error) {
      console.error('Erro ao cadastrar categoria:', error);
      Alert.alert('Erro', 'Falha ao cadastrar categoria');
    }
  };


  return (
    <View style={styles.categoriainer}>
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
        <Text style={styles.appBarTitle}>Categoria</Text>
        <View style={{ width: 50 }}></View>
      </View>

      <FlatList
      data={categorias}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.categoriaItem}>
          <Text>{item.nome}</Text>
          <Text>{item.tipo}</Text>
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
          <View style={styles.modalContent}>
            <Text>Editar Categoria</Text>
            <TextInput
              style={styles.input}
              value={novoNomeCategoria}
              onChangeText={setNovoNomeCategoria}
              placeholder="Novo nome da categoria"
            />
             <Picker
              selectedValue={novoTipoCategoria}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => setNovoTipoCategoria(itemValue)}
            >
              <Picker.Item label="Receita" value="receita" />
              <Picker.Item label="Despesa" value="despesa" />
              <Picker.Item label="Transferência" value="transferencia" />
            </Picker>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={fecharModalEdicao} style={[styles.button, { backgroundColor: 'red' }]}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAtualizarCategoria} style={[styles.button, { backgroundColor: 'green' }]}>
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
        <View style={styles.modalcategoriainer}>
          <View style={styles.modalContent}>
            <Text>Deletar Categoria</Text>
            <Text>Tem certeza que deseja deletar a categoria {categoriaEditando?.nome}?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={fecharModalDelete} style={[styles.button, { backgroundColor: 'red' }]}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeletarCategoria} style={[styles.button, { backgroundColor: 'green' }]}>
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
        <Text style={styles.addButtonText}>Adicionar Categoria</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalcategoriainer}>
          <View style={styles.modalView}>
          <Text style={styles.label}>Nome:</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Digite o nome da categoria"
      />
      <Text style={styles.label}>Tipo:</Text>
      <Picker
        selectedValue={tipo}
        style={styles.picker}
        onValueChange={(itemValue, itemIndex) => setTipo(itemValue)}
      >
        <Picker.Item label="Receita" value="receita" />
        <Picker.Item label="Despesa" value="despesa" />
        <Picker.Item label="Transferência" value="transferencia" />
      </Picker>
      <Button title="Cadastrar categoria" onPress={cadastrarCategoria} />
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
  categoriainer: {
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
  categoriaItem: {
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
  modalcategoriainer: {
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

from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from .models import Categoria, Conta, Movimentacao
from .serializer import CategoriaSerializer, ContaSerializer, MovimentacaoSerializer
from django.urls import reverse

class CategoriaViewSetTests(APITestCase):
    
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)

    def test_list_categorias(self):
        response = self.client.get('/categorias/')
        self.assertEqual(response.status_code, 200)
        # Adicione mais assertivas conforme necessário

    def test_create_categoria(self):
        data = {'nome': 'Categoria Teste', 'user': self.user.id}
        response = self.client.post('/categorias/', data, format='json')
        self.assertEqual(response.status_code, 201)
        # Adicione mais assertivas conforme necessário

    # Testes similares para update, retrieve e delete

class ContaViewSetTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)

    def test_list_contas(self):
        response = self.client.get('/contas/')
        self.assertEqual(response.status_code, 200)
        # Adicione mais assertivas conforme necessário

    def test_create_conta(self):
        data = {'nome': 'Conta Teste', 'user': self.user.id}
        response = self.client.post('/contas/', data, format='json')
        self.assertEqual(response.status_code, 201)
        # Adicione mais assertivas conforme necessário

    # Testes similares para update, retrieve e delete

class MovimentacaoViewSetTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)

    def test_list_movimentacoes(self):
        response = self.client.get('/movimentacoes/')
        self.assertEqual(response.status_code, 200)
        # Adicione mais assertivas conforme necessário

    def test_create_movimentacao(self):
        data = {'descricao': 'Movimentação Teste', 'valor': 100, 'conta': 1}  # Certifique-se de ajustar os dados conforme necessário
        response = self.client.post('/movimentacoes/', data, format='json')
        self.assertEqual(response.status_code, 201)

class ContaAPIViewTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')

    def test_create_conta(self):
        self.client.force_login(self.user)
        url = reverse('conta-create')  # Certifique-se de ajustar o nome da URL conforme definido em suas URLs
        data = {'nome': 'Conta Teste', 'user': self.user.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 201)


class MovimentacoesPaginadasTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')

    def test_get_movimentacoes_paginadas(self):
        self.client.force_login(self.user)
        url = reverse('movimentacoes-paginadas', kwargs={'user_id': self.user.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        # Adicione mais assertivas conforme necessário


from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .models.usuario import Usuario

class UserViewSetTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword', first_name='Test', email='test@example.com')
        self.token = Token.objects.create(user=self.user)

    def test_get_user_list(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_user(self):
        data = {'username': 'newuser', 'password': 'newpassword'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

class CreateUserAPITests(APITestCase):

    def test_create_user(self):
        url = reverse('create-user')
        data = {'username': 'testuser', 'password': 'testpassword', 'email': 'testuser@example.com'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'testuser')

class TokenViewTests(APITestCase):
    def setUp(self):
        self.url = reverse('token-validation')
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.token = Token.objects.create(user=self.user)

    def test_invalid_token(self):
        response = self.client.post(self.url, {'token': 'invalidtoken'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_valid_token(self):
        response = self.client.post(self.url, {'token': self.token.key})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user.username)

class UserLogoutTests(APITestCase):

    def setUp(self):
        self.url = reverse('logout')
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_logout_user(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class UsuarioViewSetTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.login(username='testuser', password='testpassword')
        self.url = reverse('usuario-list')

    def test_get_usuario_list(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_usuario(self):
        data = {'nome': 'testuser', 'email': 'testuser@example.com'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

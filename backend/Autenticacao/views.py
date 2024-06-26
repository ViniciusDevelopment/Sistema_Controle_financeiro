from django.shortcuts import render,redirect
from rest_framework import viewsets, status
from .models.usuario import Usuario
from .serializer import UserSerializer, UsuarioSerializer
from typing import Any
from django.http import HttpResponseRedirect
from django.contrib import messages
from django.contrib.auth import authenticate, get_user_model
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
from django.contrib.auth.hashers import check_password
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import Group, Permission, User
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import logout


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer 

User = get_user_model()

class CreateUserAPIView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data.get('username')
            email = serializer.validated_data.get('email')
            password = serializer.validated_data.get('password')
            new_user = User.objects.create_user(username=username, email=email, password=password)
            return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    
class UserLogout(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        logout(request)
        return Response({"message": "Logout realizado com sucesso."}, status=status.HTTP_200_OK)



class TokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('token')  # Obter o token do corpo da requisição
        try:
            # Decodificar o token para obter o usuário
            token_obj = Token.objects.get(key=token)
            user = token_obj.user
            
            # Recuperar os dados do usuário
            user_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
            }
            
            return Response(user_data)
        except Token.DoesNotExist:
            return Response({'detail': 'Token inválido'}, status=status.HTTP_404_NOT_FOUND)


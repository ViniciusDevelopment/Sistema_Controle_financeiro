from typing import Any
from django.shortcuts import render
from rest_framework.response import Response
from .models.conta import Conta
from .models.categoria import Categoria
from .models.movimentacao import Movimentacao
from .serializer import CategoriaSerializer, ContaSerializer, MovimentacaoSerializer
from rest_framework import viewsets, permissions
from django.views.generic import TemplateView, DetailView
from django.contrib.auth.mixins import LoginRequiredMixin
from rest_framework.views import APIView
from django.contrib.auth.models import Group, Permission, User
from rest_framework import status
from django.core.exceptions import ValidationError

class CategoriaViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


class ContaViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    queryset = Conta.objects.all()
    serializer_class = ContaSerializer


class MovimentacaoViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    queryset = Movimentacao.objects.all()
    serializer_class = MovimentacaoSerializer


class ContaAPIView(LoginRequiredMixin, TemplateView):
    def create(self, request, *args, **kwargs):

        data = request.POST
        conta = Conta()

        conta.user = data.get('user')
        conta.nome = data.get('nome')
        conta.imagem = request.FILES.get('imagem')
        conta.imagem = request.FILES.get('imagem')

        conta.save()

        responseData = {'mensagem': 'conta Cadastrado!',}
        status=201  
        
        return Response(responseData,status=status)
    

class UserDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id, *args, **kwargs):
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
        
        contas = Conta.objects.filter(user=user)
        categorias = Categoria.objects.filter(user=user)  # Supondo que categorias estão associadas a usuários
        movimentacoes = Movimentacao.objects.filter(conta__in=contas)
        
        contas_serializer = ContaSerializer(contas, many=True)
        categorias_serializer = CategoriaSerializer(categorias, many=True)
        movimentacoes_serializer = MovimentacaoSerializer(movimentacoes, many=True)

        response_data = {
            'contas': contas_serializer.data,
            'categorias': categorias_serializer.data,
            'movimentacoes': movimentacoes_serializer.data
        }

        return Response(response_data, status=200)

class GetCategoriaTipo(APIView):
    def get(self, request, user_id, tipo):
        try:
            categorias = Categoria.objects.filter(user_id=user_id, tipo=tipo)
            serializer = CategoriaSerializer(categorias, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Categoria.DoesNotExist:
            return Response({'error': 'Categorias não encontradas'}, status=status.HTTP_404_NOT_FOUND)

class CadastrarMovimentacao(APIView):
     def post(self, request, *args, **kwargs):
        serializer = MovimentacaoSerializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response('Movimentação cadastrada com sucesso!')
            except ValidationError as e:
                # Trata erros de validação customizados
                return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                # Trata outros erros inesperados
                return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    

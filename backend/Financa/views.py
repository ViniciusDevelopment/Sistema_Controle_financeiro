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


    

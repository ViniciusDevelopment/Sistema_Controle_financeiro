from typing import Any
from django.shortcuts import render

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


    

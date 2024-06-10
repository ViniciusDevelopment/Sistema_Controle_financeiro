from django.shortcuts import render
from rest_framework import viewsets
from .models.usuario import Usuario
from .serializer import UsuarioSerializer
from typing import Any


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

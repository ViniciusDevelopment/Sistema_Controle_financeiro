from typing import Any
from uuid import UUID
import uuid
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
from rest_framework.pagination import PageNumberPagination
from .pagination import CustomPagination  
from datetime import datetime, timedelta
from django.utils import timezone
from django.db.models import Sum, Count
from collections import defaultdict

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
        movimentacoes = Movimentacao.objects.filter(conta__in=contas).order_by('-movimentado_em')
        
        contas_serializer = ContaSerializer(contas, many=True)
        categorias_serializer = CategoriaSerializer(categorias, many=True)
        movimentacoes_serializer = MovimentacaoSerializer(movimentacoes, many=True)

        response_data = {
            'contas': contas_serializer.data,
            'categorias': categorias_serializer.data,
            'movimentacoes': movimentacoes_serializer.data
        }

        return Response(response_data, status=200)
    
class MovimentacoesPaginadas(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id, *args, **kwargs):
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
        
        contas = Conta.objects.filter(user=user)
        movimentacoes = Movimentacao.objects.filter(conta__in=contas).order_by('-movimentado_em')

        # Aplicando filtros por período
        periodo = request.query_params.get('periodo', None)
        if periodo:
            movimentacoes = self.filtrar_por_periodo(movimentacoes, periodo)

        # Paginação das movimentações
        paginator = CustomPagination()
        paginated_movimentacoes = paginator.paginate_queryset(movimentacoes, request, view=self)
        movimentacoes_serializer = MovimentacaoSerializer(paginated_movimentacoes, many=True)

        return paginator.get_paginated_response(movimentacoes_serializer.data)
    
    def filtrar_por_periodo(self, queryset, periodo):
        print(periodo)
        hoje = timezone.now().date()
        if periodo == 'hoje':
            return queryset.filter(movimentado_em__date=hoje)
        elif periodo == 'ultima_semana':
            data_inicio = hoje - timedelta(days=7)
            return queryset.filter(movimentado_em__date__gte=data_inicio, movimentado_em__date__lte=hoje)
        elif periodo == 'ultimo_mes':
            data_inicio = hoje - timedelta(days=30)
            return queryset.filter(movimentado_em__date__gte=data_inicio, movimentado_em__date__lte=hoje)
        elif periodo == 'semestre':
            data_inicio = hoje - timedelta(days=180)
            return queryset.filter(movimentado_em__date__gte=data_inicio, movimentado_em__date__lte=hoje)
        elif periodo == 'ano':
            data_inicio = hoje - timedelta(days=365)
            return queryset.filter(movimentado_em__date__gte=data_inicio, movimentado_em__date__lte=hoje)
        else:
            return queryset  # Retornar queryset sem filtros se nenhum período válido for especificado

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

class AlterarMovimentacao(APIView):
    def put(self, request, pk, *args, **kwargs):
        try:
            # Certifique-se de que o pk seja uma string antes de convertê-lo para UUID
            movimentacao_uuid = uuid.UUID(str(pk))
            movimentacao = Movimentacao.objects.get(id=movimentacao_uuid)
        except (Movimentacao.DoesNotExist, ValueError, TypeError) as e:
            return Response({'erro': 'Movimentação não encontrada.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = MovimentacaoSerializer(movimentacao, data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response('Movimentação alterada com sucesso!')
            except ValidationError as e:
                return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ContaResumoAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id, *args, **kwargs):
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        # Pega o período de tempo
        periodo = request.query_params.get('periodo', None)
        if not periodo:
            return Response({'error': 'Período não especificado'}, status=status.HTTP_400_BAD_REQUEST)
        
        hoje = timezone.now().date()
        if periodo == 'hoje':
            data_inicio = hoje
        elif periodo == 'ultima_semana':
            data_inicio = hoje - timedelta(days=7)
        elif periodo == 'ultimo_mes':
            data_inicio = hoje - timedelta(days=30)
        elif periodo == 'semestre':
            data_inicio = hoje - timedelta(days=180)
        elif periodo == 'ano':
            data_inicio = hoje - timedelta(days=365)
        else:
            return Response({'error': 'Período inválido'}, status=status.HTTP_400_BAD_REQUEST)

        data_fim = hoje

        # Movimentações no período
        movimentacoes = Movimentacao.objects.filter(conta__user=user, movimentado_em__date__gte=data_inicio, movimentado_em__date__lte=data_fim)

        # Calcula o saldo da conta
        contas = Conta.objects.filter(user=user)
        saldo_conta = sum(conta.saldo() for conta in contas)

        # Totais de receitas e despesas
        total_receitas = movimentacoes.filter(categoria__tipo='receita').aggregate(total=Sum('valor'))['total'] or 0
        total_despesas = movimentacoes.filter(categoria__tipo='despesa').aggregate(total=Sum('valor'))['total'] or 0

        # Quantidade de movimentações por tipo
        qtd_movimentacoes = movimentacoes.values('categoria__tipo').annotate(total=Count('id'))
        movimentacoes_por_tipo = defaultdict(int)
        for mov in qtd_movimentacoes:
            movimentacoes_por_tipo[mov['categoria__tipo']] = mov['total']

        # Despesas diárias no período
        despesas_diarias = movimentacoes.filter(categoria__tipo='despesa').values('movimentado_em__date').annotate(total=Sum('valor')).order_by('movimentado_em__date')
        despesas_diarias_dict = {}
        for despesa in despesas_diarias:
            despesas_diarias_dict[despesa['movimentado_em__date'].strftime('%Y-%m-%d')] = despesa['total']

        response_data = {
            'saldo_conta': saldo_conta,
            'total_receitas': total_receitas,
            'total_despesas': total_despesas,
            'movimentacoes_por_tipo': movimentacoes_por_tipo,
            'despesas_diarias': despesas_diarias_dict,
        }

        return Response(response_data, status=status.HTTP_200_OK)
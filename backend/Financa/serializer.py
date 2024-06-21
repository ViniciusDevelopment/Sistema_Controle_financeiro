from .models.movimentacao import Movimentacao
from .models.conta import Conta
from .models.categoria import Categoria
from rest_framework import serializers


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = "__all__"

class ContaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conta
        fields = ['id', 'nome', 'criado_em', 'atualizado_em', 'user', 'saldo']
    def get_saldo(self, obj):
        return obj.saldo()

class MovimentacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movimentacao
        fields = "__all__"
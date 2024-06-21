from django.conf import settings
from django.db import models
from django.contrib.auth.models import User
from uuid import uuid4
from django.db.models import Sum
from .movimentacao import Movimentacao


class Conta(models.Model):
    id = models.UUIDField(default=uuid4, primary_key=True, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    nome = models.CharField(max_length=255)
    # imagem = models.ImageField(upload_to='Imagem/Contas', null=True, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.nome} - {self.user}"
    
    def saldo(self):
        from .movimentacao import Movimentacao  # Importa aqui para evitar circular import
        from django.db.models import Sum

        # Calcular créditos
        receitas = Movimentacao.objects.filter(
            conta=self,
            categoria__tipo='receita'
        ).aggregate(total_receitas=Sum('valor'))['total_receitas'] or 0

        transferencias_entrada = Movimentacao.objects.filter(
            conta_destino=self,
            categoria__tipo='transferencia'
        ).aggregate(total_transferencias_entrada=Sum('valor'))['total_transferencias_entrada'] or 0

        # Calcular débitos
        despesas = Movimentacao.objects.filter(
            conta=self,
            categoria__tipo='despesa'
        ).aggregate(total_despesas=Sum('valor'))['total_despesas'] or 0

        transferencias_saida = Movimentacao.objects.filter(
            conta=self,
            categoria__tipo='transferencia'
        ).aggregate(total_transferencias_saida=Sum('valor'))['total_transferencias_saida'] or 0

        # Calcular saldo final
        saldo_final = (receitas + transferencias_entrada) - (despesas + transferencias_saida)
        return saldo_final
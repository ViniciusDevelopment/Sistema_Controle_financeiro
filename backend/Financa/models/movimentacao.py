import uuid
from django.db import models

from .categoria import Categoria
from .conta import Conta

class Movimentacao(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    conta = models.ForeignKey(Conta, on_delete=models.PROTECT, related_name='movimentacoes_origem')
    conta_destino = models.ForeignKey(Conta, on_delete=models.SET_NULL, null=True, related_name='movimentacoes_destino')
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True)
    valor = models.DecimalField(decimal_places=2, max_digits=11)
    descricao = models.TextField(blank=True, null=True)
    movimentado_em = models.DateTimeField()
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)
    # comprovante = models.FileField(upload_to='Imagem/Movimentacao', null=True)

    def __str__(self):
        return f'Nickname: {self.descricao} | E-mail: {self.categoria}'

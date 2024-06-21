import uuid
from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from .categoria import Categoria

class Movimentacao(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    conta = models.ForeignKey('Conta', on_delete=models.PROTECT, related_name='movimentacoes_origem')
    conta_destino = models.ForeignKey('Conta', on_delete=models.SET_NULL, null=True, blank=True, related_name='movimentacoes_destino')
    categoria = models.ForeignKey(Categoria, on_delete=models.PROTECT)
    valor = models.DecimalField(decimal_places=2, max_digits=11)
    descricao = models.TextField()
    movimentado_em = models.DateTimeField()
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(null=True, blank=True)
    # comprovante = models.FileField(upload_to='Imagem/Movimentacao', null=True)
    
    def clean(self):
        if self.conta_destino == self.conta:
            raise ValidationError(_('Não é permitido transferência para a mesma conta de origem.'))

        if self.categoria.tipo == 'transferencia':
            saldo_conta_origem = self.conta.saldo()

            if self.valor > saldo_conta_origem:
                raise ValidationError(_('Saldo insuficiente na conta de origem para realizar a transferência.'))

    def save(self, *args, **kwargs):
        self.clean()  # Chama o método clean() para validar antes de salvar
        super().save(*args, **kwargs)  # Chama o método save() padrão do Django

    def __str__(self):
        return f'Nickname: {self.descricao} | E-mail: {self.categoria}'
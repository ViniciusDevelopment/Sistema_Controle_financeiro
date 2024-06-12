from django.db import models
from django.contrib.auth.models import User
from uuid import uuid4


class Conta(models.Model):
    id = models.UUIDField(default=uuid4, primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    nome = models.CharField(max_length=255)
    imagem = models.ImageField(upload_to='Imagem/Contas', null=True, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.nome} - {self.user}"
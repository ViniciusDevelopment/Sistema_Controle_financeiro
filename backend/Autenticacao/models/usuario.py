import uuid
from django.db import models
from django.contrib.auth.hashers import make_password

class Usuario(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, unique=True, default=uuid.uuid4)
    nome = models.CharField(max_length=100, blank=False, null=False, default='')
    email = models.EmailField(unique=True, blank=False, null=False, default='')
    senha = models.CharField(max_length=128, blank=False, null=False, default='')

    def __str__(self):
        return f'Nickname: {self.nome} | E-mail: {self.email}'

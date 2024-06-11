import uuid
from django.db import models
from django.contrib.auth.hashers import make_password
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import AbstractUser

# class CustomUserManager(BaseUserManager):
#     def create_user(self, email, senha=None, **extra_fields):
#         email = self.normalize_email(email)
#         user=self.model(email=email, **extra_fields)
#         user.set_password(senha)
#         user.save()
#         return user
    
#     def create_superuser(self, email, senha=None, **extra_fields):
#         extra_fields.setdefault("is_staff", True)
#         extra_fields.setdefault("is_superuser", True)

#         if extra_fields.get("is_staff") is not True:
#             raise ValueError("Erro ao criar super usuario")
        
#         if extra_fields.get("is_superuser") is not True:
#             raise ValueError("Erro ao criar super usuario")
        
#         return self.create_user(email, senha, **extra_fields)

class Usuario(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, unique=True, default=uuid.uuid4)
    nome = models.CharField(max_length=100, blank=False, null=False)
    email = models.EmailField(unique=True, blank=False, null=False)
    senha = models.CharField(blank=False, null=False)

    # objects=CustomUserManager()
    # USERNAME_FIELD = 'email'
    # REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f'Nickname: {self.nome} | E-mail: {self.email}'

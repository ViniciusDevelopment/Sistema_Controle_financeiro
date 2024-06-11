from .models.usuario import Usuario
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group, Permission, User

class UsuarioSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name="Autenticacao:usuario-detail")
    class Meta:
        model = Usuario
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name="Autenticacao:user-detail")
    class Meta:
        model = User
        fields = "__all__"

    

# class GroupSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Group
#         fields = "__all__"

# class PermissionSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Permission
#         fields = "__all__"

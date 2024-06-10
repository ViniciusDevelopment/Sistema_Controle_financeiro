from .models.usuario import Usuario
from rest_framework import serializers


class UsuarioSerializer(serializers.HyperlinkedModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name="Autenticacao:usuario-detail")
    class Meta:
        model = Usuario
        fields = "__all__"
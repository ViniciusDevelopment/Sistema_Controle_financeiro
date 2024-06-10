from django.contrib import admin
from django.urls import include, path
# from .views import AutenticacaoView
from .views import UsuarioViewSet
from rest_framework import routers

app_name = 'Autenticacao'

router = routers.DefaultRouter()
router.register(r'/usuario', UsuarioViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
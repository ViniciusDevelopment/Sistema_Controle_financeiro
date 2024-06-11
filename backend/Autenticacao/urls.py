from django.contrib import admin
from django.urls import include, path
# from .views import AutenticacaoView
from .views import LoginView, UserViewSet, UsuarioViewSet
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.authtoken import views
from rest_framework.authtoken.models import Token

app_name = 'Autenticacao'

router = routers.DefaultRouter()
router.register(r'/usuario', UserViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('/login', views.obtain_auth_token),
]
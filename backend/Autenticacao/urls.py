from django.contrib import admin
from django.urls import include, path
# from .views import AutenticacaoView
from .views import CreateUserAPIView, TokenView, UserLogout, UserViewSet, UsuarioViewSet
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.authtoken import views
from rest_framework.authtoken.models import Token

app_name = 'Autenticacao'

router = routers.DefaultRouter()
router.register(r'/usuario', UserViewSet)
# router.register(r'/create-user', CreateUserAPIView.as_view())

urlpatterns = [
    path('', include(router.urls)),
    path('/login', views.obtain_auth_token),
    path('/create-user', CreateUserAPIView.as_view(), name='create-user'),
    path('/tokenvalidation', TokenView.as_view(), name='token-validation'),
    path('/logout', UserLogout.as_view(), name='logout'),
]
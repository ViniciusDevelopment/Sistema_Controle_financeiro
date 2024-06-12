from django.contrib import admin
from django.urls import include, path
from .views import CategoriaViewSet, ContaViewSet, MovimentacaoViewSet
from rest_framework import routers
from django.conf import settings
from django.conf.urls.static import static


app_name = 'Financa'

router = routers.DefaultRouter()
router.register('/categoria', CategoriaViewSet)
router.register('/conta', ContaViewSet)
router.register('/movimentacao', MovimentacaoViewSet)


urlpatterns = [
    path('', include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
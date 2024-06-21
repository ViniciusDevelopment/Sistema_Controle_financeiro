from django.contrib import admin
from django.urls import include, path
from .views import CadastrarMovimentacao, CategoriaViewSet, ContaViewSet, GetCategoriaTipo, MovimentacaoViewSet, UserDetailView
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
    path('/GetFinancas/<int:user_id>/', UserDetailView.as_view()),
    path('/GetCategoriaTipo/<int:user_id>/<str:tipo>/', GetCategoriaTipo.as_view(), name='get_categoria_tipo'),
    path('/CadastrarMovimentacao', CadastrarMovimentacao.as_view()),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
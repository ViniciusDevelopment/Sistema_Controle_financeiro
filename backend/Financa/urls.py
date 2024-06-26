from django.contrib import admin
from django.urls import include, path
from .views import AlterarMovimentacao, CadastrarMovimentacao, CategoriaViewSet, ContaResumoAPIView, ContaViewSet, GetCategoriaTipo, MovimentacaoViewSet, MovimentacoesPaginadas, UserDetailView
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
    path('/AlterarMovimentacao/<uuid:pk>/', AlterarMovimentacao.as_view()),
    path('/GetMovimentacoesPaginadas/<int:user_id>/', MovimentacoesPaginadas.as_view()),
    path('/GetMovimentacoesGraficos/<int:user_id>/', ContaResumoAPIView.as_view()),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
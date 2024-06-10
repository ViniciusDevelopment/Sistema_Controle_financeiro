from django.contrib import admin
from django.urls import include, path
from django.urls import reverse
from rest_framework.response import Response
from rest_framework.views import APIView


class APIRoot(APIView):
    def get(self, request, *args, **kwargs):
        return Response({
            'Autenticacao': request.build_absolute_uri(reverse('Autenticacao:api-root')),
            # 'Financas': request.build_absolute_uri(reverse('Financas:api-root'))
        })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', APIRoot.as_view(), name='api-root'),
    path('api/Autenticacao', include('Autenticacao.urls', namespace='Autenticacao')),
    # path('api/Financas', include('Financas.urls', namespace='Financas')),
]

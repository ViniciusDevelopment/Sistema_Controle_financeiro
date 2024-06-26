from rest_framework.pagination import PageNumberPagination

class CustomPagination(PageNumberPagination):
    page_size = 200  # Defina o tamanho da página
    page_size_query_param = 'page_size'
    max_page_size = 100
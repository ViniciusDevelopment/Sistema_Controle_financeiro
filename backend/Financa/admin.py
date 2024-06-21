from django.contrib import admin
from .models import Conta, Movimentacao, Categoria

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    pass


@admin.register(Conta)
class ContaAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "nome",
        "exibir_saldo"
    )

    list_filter = (
        "user",
    )
    def exibir_saldo(self, obj):
        return obj.saldo()  # Chama o método saldo() para obter o saldo final

    exibir_saldo.short_description = 'Saldo Final'


@admin.register(Movimentacao)
class MovimentacaoAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "conta",
        "valor",
        "movimentado_em",
        "get_categoria_tipo",
    )

    list_filter = (
        "conta",
        "categoria",
        "movimentado_em",
    )
    def get_categoria_tipo(self, obj):
        return obj.categoria.tipo 

    get_categoria_tipo.short_description = 'Tipo da Categoria'
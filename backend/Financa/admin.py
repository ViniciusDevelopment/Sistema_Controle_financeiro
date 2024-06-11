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
    )

    list_filter = (
        "user",
    )


@admin.register(Movimentacao)
class MovimentacaoAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "conta",
        "valor",
        "movimentado_em",
    )

    list_filter = (
        "conta",
        "categoria",
        "movimentado_em",
    )
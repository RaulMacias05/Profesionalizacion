from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario

class UsuarioAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Información adicional', {
            'fields': ('rol', 'telefono', 'direccion', 'dni'),
        }),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Información adicional', {
            'fields': ('rol', 'telefono', 'direccion', 'dni'),
        }),
    )

    list_display = ('username', 'email', 'rol', 'telefono', 'is_staff', 'is_active')
    search_fields = ('username', 'email', 'dni')
    list_filter = ('rol', 'is_active')

admin.site.register(Usuario, UsuarioAdmin)

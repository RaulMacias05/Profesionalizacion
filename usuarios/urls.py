from django.urls import path
from .views import usuarios, registrar_usuario, lista_usuarios, signout

app_name = 'usuarios'

urlpatterns = [
    path('', usuarios, name='usuarios'),
    path('registrar/', registrar_usuario, name='registrar_usuario'),
    path('lista/', lista_usuarios, name='lista_usuarios'),
    path('signout/', signout, name='signout'),
]
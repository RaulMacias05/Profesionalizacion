from django.urls import path
from .views import ventas, registrar_venta, listar_ventas

app_name = 'ventas'

urlpatterns = [
    path('', ventas, name='ventas'),
    path('registrar/', registrar_venta, name='registrar_venta'),
    path('listar/', listar_ventas, name='listar_ventas')
]

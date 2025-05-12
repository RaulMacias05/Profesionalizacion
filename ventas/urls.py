from django.urls import path
from .views import ventas, registrar_venta, listar_ventas, registrar_venta_copy
from . import views

app_name = 'ventas'

urlpatterns = [
    path('', ventas, name='ventas'),
    path('registrar/', registrar_venta, name='registrar_venta'),
    path('listar/', listar_ventas, name='listar_ventas'),
    path('registrar-copy/', views.registrar_venta_copy, name='registrar_venta_copy'),
]

from django.urls import path
from .views import inventario, crear_producto, editar_producto, eliminar_producto, ver_producto, buscar_producto

app_name = 'inventario'

urlpatterns = [
    path('', inventario, name='inventario'),
    path('crear/', crear_producto, name='crear_producto'),
    path('editar/<int:producto_id>/', editar_producto, name='editar_producto'),
    path('eliminar/<int:producto_id>/', eliminar_producto, name='eliminar_producto'),
    path('ver/<int:producto_id>/', ver_producto, name='ver_producto'),
    path('buscar/', buscar_producto, name='buscar_producto'),
]
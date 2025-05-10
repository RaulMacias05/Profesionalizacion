from django.urls import path
from .views import membresias, crear_membresia, editar_membresia, eliminar_membresia, activar_membresia, desactivar_membresia
from . import views

app_name = 'membresias'

urlpatterns = [
    path('', membresias, name='membresias'),
    path('crear/', views.crear_membresia, name='crear_membresia'),
    path('editar/<int:membresia_id>/', editar_membresia, name='editar_membresia'),
    path('eliminar/<int:membresia_id>/', eliminar_membresia, name='eliminar_membresia'),
    path('activar/<int:membresia_id>/', activar_membresia, name='activar_membresia'),
    path('desactivar/<int:membresia_id>/', desactivar_membresia, name='desactivar_membresia'),
]
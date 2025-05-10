from django.urls import path
from .views import signin, inicio

app_name = 'core'

urlpatterns = [
    path('', signin, name='signin'),
    path('inicio/', inicio, name='inicio'),   
]
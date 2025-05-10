from django.db import models
from django.utils import timezone
from datetime import date

class Clientes(models.Model):
    nombre=models.CharField(max_length=100)
    telefono=models.CharField(max_length=20)
    correo=models.EmailField(max_length=254)
    direccion=models.CharField(max_length=200)
    
    def __str__(self):
        return self.nombre
    
    # @property
    # def membresia_activa(self):
    #     try:
    #         membresia = self.membresia_set.order_by('-fecha_vencimiento').first()
    #         return bool(membresia and membresia.activa and membresia.fecha_vencimiento >= date.today())
    #     except:
    #         return False


class RegistroAsistencia(models.Model):
    cliente = models.ForeignKey(Clientes, on_delete=models.CASCADE)
    fecha = models.DateField(auto_now_add=True)
    hora_entrada = models.DateTimeField(null=True, blank=True)
    hora_salida = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.cliente} - {self.fecha}"
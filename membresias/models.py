from django.db import models
from clientes.models import Clientes
# from datetime import datetime

class Membresia(models.Model):
    cliente = models.ForeignKey(Clientes, on_delete=models.CASCADE, null=True, blank=True, unique=True)
    fecha_inicio = models.DateTimeField(auto_now_add=True)
    fecha_vencimiento = models.DateTimeField()
    activa = models.BooleanField(default=True)
    metodo_pago = models.CharField(max_length=50, choices=[('efectivo', 'Efectivo'), ('tarjeta', 'Tarjeta')])
    monto_pagado = models.DecimalField(max_digits=10, decimal_places=2)
    cambio = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    def __str__(self):
        return f"{self.cliente} ({self.fecha_inicio} - {self.fecha_vencimiento})"
    
    # def esta_activa(self):
    #     return self.activa and self.fecha_vencimiento >= datetime.today()
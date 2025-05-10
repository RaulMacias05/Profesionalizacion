from django.db import models
from django.conf import settings
# from django.contrib.auth import get_user_model
# from django.contrib.auth.models import User


# Create your models here.
class Venta(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    fecha_venta = models.DateTimeField(auto_now_add=True)
    monto_total = models.DecimalField(max_digits=10, decimal_places=2)
    metodo_pago = models.CharField(max_length=50, choices=[('efectivo', 'Efectivo'), ('tarjeta', 'Tarjeta')])
    monto_pagado = models.DecimalField(max_digits=10, decimal_places=2)
    cambio = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    # idcliente = models.ForeignKey('clientes.Cliente', on_delete=models.CASCADE, null=True, blank=True)
    productos = models.ManyToManyField('inventario.Producto', through='DetalleVenta')

    def __str__(self):
        return f"Venta {self.id} - Total: {self.total}"
    
class DetalleVenta(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE)
    producto = models.ForeignKey('inventario.Producto', on_delete=models.CASCADE)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    cantidad = models.PositiveIntegerField()

    def __str__(self):
        return f"Detalle de Venta {self.venta.id} - Producto: {self.producto.nombre}"
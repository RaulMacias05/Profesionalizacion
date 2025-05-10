from django.shortcuts import render
from inventario.models import Producto
from ventas.models import Venta, DetalleVenta
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from .forms import VentaForm
from django.shortcuts import render

# Create your views here.
def ventas(request):
    return render(request, 'ventas/ventas.html')

def listar_ventas(request):
    return render(request, 'ventas/listar_ventas.html', {
        'ventas': Venta.objects.all()
        })

def registrar_venta(request):
    if request.method == "POST":
        form = VentaForm(request.POST)
        if form.is_valid():
            try:
                # Guardar la venta
                venta = form.save(commit=False)
                venta.usuario = request.user
                venta.monto_total = request.POST.get('total', 0)
                venta.monto_pagado = request.POST.get('monto_pagado', 0)
                venta.cambio = float(venta.monto_pagado) - float(venta.monto_total)
                venta.save()

                # Guardar los detalles de la venta
                productos_ids = json.loads(request.POST.get('productos', '[]'))
                for producto_id in productos_ids:
                    producto = Producto.objects.get(idproducto=producto_id)
                    DetalleVenta.objects.create(
                        venta=venta,
                        producto=producto,
                        precio_unitario=producto.precio,
                        cantidad=1 # Ajustar según sea necesario
                    )

                return JsonResponse({"status": "success", "message": "Venta registrada exitosamente."})
            except Exception as e:
                return JsonResponse({"status": "error", "message": str(e)})
        else:
            return JsonResponse({"status": "error", "message": "Formulario inválido."})
    else:
        form = VentaForm()
        return render(request, 'ventas/registrar_venta.html', {
            'productos': Producto.objects.all(),
            'form': form
        })
        
from django.shortcuts import render
from django.db.models import Sum
from ventas.models import Venta
from clientes.models import Clientes
from inventario.models import Producto
from django.contrib.auth.models import User
import openpyxl
from django.http import HttpResponse
from datetime import date



# Create your views here.
def reportes(request):
    # Obtener los datos para cada reporte
    ventas = Venta.objects.all()
    clientes = Clientes.objects.all()
    productos = Producto.objects.all()

    # Calcular algunos valores agregados para cada reporte
    total_ventas = ventas.aggregate(Sum('monto_total'))['monto_total__sum'] or 0
    total_clientes = clientes.count()
    total_productos = productos.count()

    # Dividir clientes en activos e inactivos
    activos = clientes.filter(membresia=True).count()
    inactivos = clientes.filter(membresia=False).count()

    # Devolver los datos a la plantilla
    return render(request, 'reportes/reportes.html', {
        'ventas': ventas,
        'clientes': clientes,
        'productos': productos,
        'total_ventas': total_ventas,
        'total_clientes': total_clientes,
        'total_productos': total_productos,
        'activos': activos,
        'inactivos': inactivos,
    })


def generar_reporte_ventas(request):
    # Filtrar ventas del día
    ventas = Venta.objects.all()

    # Calcular el total de ventas del día
    total_ventas = ventas.aggregate(Sum('monto_total'))['monto_total__sum'] or 0

    # Calcular el total de ventas por método de pago
    total_efectivo = ventas.filter(metodo_pago='efectivo').aggregate(Sum('monto_total'))['monto_total__sum'] or 0
    total_tarjeta = ventas.filter(metodo_pago='tarjeta').aggregate(Sum('monto_total'))['monto_total__sum'] or 0

    return render(request, 'reportes/generar_reporte_ventas.html', {
        'ventas': ventas,
        'total_ventas': total_ventas,
        'total_efectivo': total_efectivo,
        'total_tarjeta': total_tarjeta
    })


def generar_reporte_clientes(request):
    # Obtener todos los clientes
    clientes = Clientes.objects.all()

    # Calcular la cantidad de clientes activos y no activos
    activos = clientes.filter(membresia=True).count()
    inactivos = clientes.filter(membresia=False).count()

    return render(request, 'reportes/generar_reporte_clientes.html', {
        'clientes': clientes,
        'activos': activos,
        'inactivos': inactivos
    })

def generar_reporte_productos(request):
    # Obtener todos los productos
    productos = Producto.objects.all()

    # Calcular el total de productos en stock
    total_stock = productos.aggregate(Sum('stock'))['stock__sum'] or 0

    return render(request, 'reportes/generar_reporte_productos.html', {
        'productos': productos,
        'total_stock': total_stock
    })
    
def generar_reporte_membresias(request):
    # Obtener clientes con membresía activa e inactiva
    activos = Clientes.objects.filter(membresia=True)
    inactivos = Clientes.objects.filter(membresia=False)

    return render(request, 'reportes/generar_reporte_membresias.html', {
        'activos': activos,
        'inactivos': inactivos
    })

def generar_reporte_usuarios(request):
    # Obtener todos los usuarios
    usuarios = User.objects.all()

    return render(request, 'reportes/generar_reporte_usuarios.html', {
        'usuarios': usuarios
    })
    
def exportar_clientes_excel(request):
    # Crear un libro de trabajo y una hoja
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Clientes"

    # Encabezados
    ws.append(["Nombre", "Correo", "Teléfono", "Dirección", "Membresía Activa"])

    # Datos
    for cliente in Clientes.objects.all():
        membresia_activa = cliente.membresia_set.filter(activa=True, fecha_vencimiento__gte=date.today()).exists()
        ws.append([
            cliente.nombre,
            cliente.correo,
            cliente.telefono,
            cliente.direccion,
            "Sí" if membresia_activa else "No"
        ])

   
    response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    hoy = date.today().strftime('%Y-%m-%d')
    response['Content-Disposition'] = f'attachment; filename=clientes_{hoy}.xlsx'
    wb.save(response)
    return response
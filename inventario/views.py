from django.shortcuts import render, redirect
from .forms import CrearProductoForm
from .models import Producto

# Create your views here.
def inventario(request):
    return render(request, 'inventario/inventario.html', {
        'productos': Producto.objects.all()
    })

def crear_producto(request):    
    if request.method == 'POST':
        form = CrearProductoForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('inventario:inventario')  # Redirige a la vista de inventario después de guardar el producto
    else:
        form = CrearProductoForm()

    return render(request, 'inventario/crear_producto.html', {'form': form})

def editar_producto(request, producto_id):
    if request.method == 'POST':
        # Aquí puedes manejar el formulario para editar el producto existente
        pass  # Reemplaza esto con tu lógica de edición de producto

    return render(request, 'inventario/editar_producto.html', {'producto_id': producto_id})

def eliminar_producto(request, producto_id):
    if request.method == 'POST':
        # Aquí puedes manejar la lógica para eliminar el producto
        pass  # Reemplaza esto con tu lógica de eliminación de producto

    return render(request, 'inventario/eliminar_producto.html', {'producto_id': producto_id})

def ver_producto(request, producto_id):
    # Aquí puedes manejar la lógica para ver los detalles del producto
    return render(request, 'inventario/ver_producto.html', {'producto_id': producto_id})

def buscar_producto(request):
    if request.method == 'POST':
        # Aquí puedes manejar la lógica para buscar un producto
        pass  # Reemplaza esto con tu lógica de búsqueda de producto

    return render(request, 'inventario/buscar_producto.html')

def activar_producto(request, producto_id):
    if request.method == 'POST':
        # Aquí puedes manejar la lógica para activar el producto
        pass  # Reemplaza esto con tu lógica de activación de producto

    return render(request, 'inventario/activar_producto.html', {'producto_id': producto_id})

def desactivar_producto(request, producto_id):
    if request.method == 'POST':
        # Aquí puedes manejar la lógica para desactivar el producto
        pass  # Reemplaza esto con tu lógica de desactivación de producto

    return render(request, 'inventario/desactivar_producto.html', {'producto_id': producto_id}) 
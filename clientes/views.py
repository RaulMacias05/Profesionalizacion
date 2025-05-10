from django.shortcuts import render
from .forms import RegistrarClienteForm
from .models import Clientes, RegistroAsistencia
from django.shortcuts import redirect, get_object_or_404
from django.utils import timezone

# Create your views here.
def clientes(request):
    return render(request, 'clientes/clientes.html', {
        'clientes': Clientes.objects.all()
    })

def crear_cliente(request):
    if request.method == 'POST':
        form = RegistrarClienteForm(request.POST)
        if form.is_valid():
            form.save()
            return render(request, 'clientes/crear_cliente.html', {"form":form, "mensaje":"Cliente creado exitosamente"})
        else:
            return render(request, 'clientes/crear_cliente.html', {"form":form, "mensaje":"Error al crear el cliente"})
    elif request.method == 'GET':
        form = RegistrarClienteForm()

    return render(request, 'clientes/crear_cliente.html', {"form":form})

def editar_cliente(request, cliente_id):
    if request.method == 'POST':
        # Aquí puedes manejar el formulario para editar el cliente existente
        pass  # Reemplaza esto con tu lógica de edición de cliente

    return render(request, 'clientes/editar_cliente.html', {'cliente_id': cliente_id})

def eliminar_cliente(request, cliente_id):
    if request.method == 'POST':
        # Aquí puedes manejar la lógica para eliminar el cliente
        pass  # Reemplaza esto con tu lógica de eliminación de cliente

    return render(request, 'clientes/eliminar_cliente.html', {'cliente_id': cliente_id})


def registrar_asistencia(request, cliente_id):
    cliente = get_object_or_404(Clientes, id=cliente_id)
    hoy = timezone.now().date()

    registro, creado = RegistroAsistencia.objects.get_or_create(
        cliente=cliente, fecha=hoy
    )

    if not registro.hora_entrada:
        registro.hora_entrada = timezone.now()
    elif not registro.hora_salida:
        registro.hora_salida = timezone.now()

    registro.save()
    return redirect('clientes') 
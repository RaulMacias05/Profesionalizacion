from django.shortcuts import render
from .forms import MembresiaForm
from django.shortcuts import render, redirect
from .models import Membresia
from dateutil.relativedelta import relativedelta 

# Create your views here.
def membresias(request):
    membresias = Membresia.objects.all()
    return render(request, 'membresias/membresias.html' , {'membresias': membresias})
        

def crear_membresia(request):
    cambio = None
    precio_membresia = 100  # ajusta según tu lógica real

    if request.method == 'POST':
        form = MembresiaForm(request.POST)
        if form.is_valid():
            metodo_pago = form.cleaned_data['metodo_pago']
            monto_pagado = form.cleaned_data['monto_pagado']
            membresia = form.save(commit=False)
            membresia.fecha_vencimiento = form.get_fecha_inicio() + relativedelta(months=1)

            if metodo_pago == 'efectivo':
                cambio = monto_pagado - precio_membresia
                if cambio < 0:
                    form.add_error('monto_pagado', 'El monto es insuficiente.')
                else:
                    form.save()
                    membresia.cambio = cambio
                    membresia.save()
                    return redirect('membresias:membresias')
            else:
                membresia.cambio = 0
                membresia.save()
                return redirect('membresias:membresias')
    else:
        form = MembresiaForm()

    return render(request, 'membresias/crear_membresia.html', {'form': form, 'cambio': cambio})


def editar_membresia(request, membresia_id):
    if request.method == 'POST':
        # Aquí puedes manejar el formulario para editar la membresía existente
        pass  # Reemplaza esto con tu lógica de edición de membresía

    return render(request, 'membresias/editar_membresia.html', {'membresia_id': membresia_id})

def eliminar_membresia(request, membresia_id):
    if request.method == 'POST':
        # Aquí puedes manejar la lógica para eliminar la membresía
        pass  # Reemplaza esto con tu lógica de eliminación de membresía

    return render(request, 'membresias/eliminar_membresia.html', {'membresia_id': membresia_id})

def activar_membresia(request, membresia_id):
    if request.method == 'POST':
        # Aquí puedes manejar la lógica para activar la membresía
        pass  # Reemplaza esto con tu lógica de activación de membresía

    return render(request, 'membresias/activar_membresia.html', {'membresia_id': membresia_id})

def desactivar_membresia(request, membresia_id):
    if request.method == 'POST':
        # Aquí puedes manejar la lógica para desactivar la membresía
        pass  # Reemplaza esto con tu lógica de desactivación de membresía

    return render(request, 'membresias/desactivar_membresia.html', {'membresia_id': membresia_id})

from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from datetime import datetime
from ventas.models import Venta
from clientes.models import Clientes
from membresias.models import Membresia

# Create your views here.
def signin(request):
    if request.method == "GET":
        return render(request, 'core/signin.html', {
            'form': AuthenticationForm
        })
    else:
        user = authenticate(
            request, username=request.POST['username'], password=request.POST['password'])

        if user is None:
            return render(request, 'core/signin.html', {
                'form': AuthenticationForm,
                'error': 'Usuario o contraseña incorrectos'
            })
        else:
            login(request, user)
            return redirect('core:inicio')

def inicio(request):
    ventas = Venta.objects.all()
    ventas_hoy = sum(1 for i in ventas.filter(fecha_venta__date=datetime.today().date()))
    total_clientes = Clientes.objects.count()
    total_membresias_activas = Membresia.objects.filter(activa=True).count()

    return render(request, 'core/inicio.html', {
        'ventas_hoy': ventas_hoy,
        'total_clientes': total_clientes,
        'total_membresias_activas': total_membresias_activas    
    })




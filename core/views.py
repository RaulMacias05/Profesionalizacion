from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from datetime import datetime
from ventas.models import Venta

# Create your views here.
def signin(request):
    return redirect('core:inicio')

def inicio(request):
    ventas = Venta.objects.all()
    ventas_hoy = sum(1 for i in ventas.filter(fecha_venta__date=datetime.today().date()))

    return render(request, 'core/inicio.html', {
        'ventas_hoy': ventas_hoy,
    })




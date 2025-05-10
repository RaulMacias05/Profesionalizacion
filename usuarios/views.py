from django.shortcuts import render, redirect
from .forms import RegistroUsuarioForm
from django.shortcuts import redirect
from django.contrib.auth import get_user_model
from django.contrib.auth import logout

def usuarios(request):
    return redirect('usuarios:lista_usuarios')

def lista_usuarios(request):
    Usuario = get_user_model()
    usuarios = Usuario.objects.all()
    return render(request, 'usuarios/lista_usuarios.html', {'usuarios': usuarios})

def registrar_usuario(request):
    if request.method == 'POST':
        form = RegistroUsuarioForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('usuarios:lista_usuarios')
    else:
        form = RegistroUsuarioForm()
    return render(request, 'usuarios/registrar_usuarios.html', {'form': form})

def signout(request):
    logout(request)
    return redirect('core:signin')
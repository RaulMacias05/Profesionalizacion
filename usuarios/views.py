from django.shortcuts import render, redirect
from .forms import RegistroUsuarioForm
from django.shortcuts import redirect
from django.contrib.auth import get_user_model
from django.contrib.auth import login, logout, authenticate
from django.db import IntegrityError
from django.contrib.auth.forms import AuthenticationForm

def usuarios(request):
    return redirect('usuarios:lista_usuarios')

def lista_usuarios(request):
    Usuario = get_user_model()
    usuarios = Usuario.objects.all()
    return render(request, 'usuarios/lista_usuarios.html', {'usuarios': usuarios})

def signin(request):
    if request.method == "GET":
        return render(request, 'usuarios/signin.html', {
            'form': AuthenticationForm
        })
    else:
        user = authenticate(
            request, username=request.POST['username'], password=request.POST['password'])

        if user is None:
            return render(request, 'usuarios/signin.html', {
                'form': AuthenticationForm,
                'error': 'Usuario o contraseña incorrectos'
            })
        else:
            login(request, user)
            return redirect('core:inicio')

def registrar_usuario(request):
    if request.method == 'POST':
        if request.POST['password1'] == request.POST['password2']:
            try:
                user = RegistroUsuarioForm(request.POST)
                if user.is_valid():
                    user.save()
                    return redirect('usuarios:lista_usuarios')
                else:
                    return render(request, 'usuarios/registrar_usuarios.html', {
                        'form': user,
                        'error': 'Por favor corrige los errores en el formulario.'
                    })
            except Exception as e:
                return render(request, 'usuarios/registrar_usuarios.html', {
                    'form': RegistroUsuarioForm(),
                    'error': f'Error inesperado: {str(e)}'
                })
            except IntegrityError:
                return render(request, 'usuarios/registrar_usuarios.html', {
                    'form': RegistroUsuarioForm(),
                    'error': 'Error de integridad: el usuario ya existe'
                })
            except ValueError:
                return render(request, 'usuarios/registrar_usuarios.html', {
                    'form': RegistroUsuarioForm(),
                    'error': 'Error de valor: los datos no son válidos'
                })
        else:   
            return render(request, 'usuarios/registrar_usuarios.html', {
                'form': RegistroUsuarioForm(),
                'error': 'Error de validación: Las contraseñas no coinciden'
            })
        
    else:
        return render(request, 'usuarios/registrar_usuarios.html', {
            'form': RegistroUsuarioForm()
        })
      
def signout(request):
    logout(request)
    return redirect('core:signin')
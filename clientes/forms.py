from django import forms
from .models import Clientes

class RegistrarClienteForm(forms.ModelForm):
    class Meta:
        model=Clientes
        fields=["nombre","telefono","correo","direccion"]
        widgets={
            "nombre":forms.TextInput(attrs={"class":"form-control"}),
            "telefono":forms.TextInput(attrs={"class":"form-control"}),
            "correo":forms.EmailInput(attrs={"class":"form-control"}),
            "direccion":forms.TextInput(attrs={"class":"form-control"})
        }
        
        
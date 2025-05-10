from django import forms
from .models import Venta

class VentaForm(forms.ModelForm):
    class Meta:
        model = Venta
        fields = ['metodo_pago', 'monto_pagado']
        widgets = {
            'metodo_pago': forms.Select(attrs={'class': 'form-control'}),
            'monto_pagado': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01'}),
        }
        labels = {
            'metodo_pago': 'Método de Pago',
            'monto_pagado': 'Monto Pagado',
        }
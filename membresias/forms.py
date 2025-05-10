from django import forms
from .models import Membresia
from datetime import date, timedelta
from dateutil.relativedelta import relativedelta  # Necesario para sumar meses

class MembresiaForm(forms.ModelForm):
    class Meta:
        model = Membresia
        # fields = ['cliente', 'metodo_pago', 'monto_pagado', 'fecha_inicio', 'fecha_vencimiento']
        fields = ['cliente', 'metodo_pago', 'monto_pagado']
        widgets = {
            'metodo_pago': forms.Select(attrs={'class': 'form-control'}),
            'monto_pagado': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01'}),
        }
        labels = {
            'metodo_pago': 'Método de Pago',
            'monto_pagado': 'Monto Pagado',
        }
    
    def get_fecha_inicio(self):
        return self.cleaned_data.get('fecha_inicio', date.today()) 

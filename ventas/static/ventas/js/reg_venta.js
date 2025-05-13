// registrar_venta_prof.js


// Carrito de compras
const Carrito = {
  items: [],
  total: 0,

  agregarProducto(id, nombre, precio) {
    let item = this.items.find(p => p.id === id);
    if (item) {
      item.cantidad += 1;
    } else {
      this.items.push({ id, nombre, precio, cantidad: 1 });
    }
    this.actualizarTotal();
  },

  quitarProducto(id) {
    let item = this.items.find(p => p.id === id);
    if (item) {
      item.cantidad -= 1;
      if (item.cantidad <= 0) {
        this.items = this.items.filter(p => p.id !== id);
      }
      this.actualizarTotal();
    }
  },

  actualizarTotal() {
    const subtotal = this.items.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
    const iva = subtotal * 0.16;
    this.total = subtotal + iva;
  },

  limpiar() {
    this.items = [];
    this.total = 0;
  },
};




// UI y eventos
const UI = {
  elementos: {
    productos: document.querySelectorAll(".producto"),
    totalBar: document.getElementById("venta_container"),
    totalText: document.getElementById("total_text"),
    registrarVentaBtn: document.getElementById("btn_registrar_venta"),
    cancelarPagarBtn: document.getElementById("btn_cancelar_venta"),
    confirmarVentaBtn: document.getElementById("confirmar_venta"),
    cancelarVentaBtn: document.getElementById("cancelar_venta"),
    ventaForm: document.getElementById("venta_form"),
    ventaModal: document.getElementById("venta_modal"),
    modalOverlay: document.getElementById("modal_overlay"),
    ticketList: document.getElementById("ticket_list"),
    modalSubtotal: document.getElementById("modal_subtotal"),
    modalIva: document.getElementById("modal_iva"),
    modalTotal: document.getElementById("modal_total"),
    facturacionModal: document.getElementById("facturacion_modal"),
    facturarSiBtn: document.getElementById("facturar_si"),
    facturarNoBtn: document.getElementById("facturar_no"),
    facturaForm: document.getElementById("factura_form"),
    cantidadSpan: document.querySelectorAll(".cantidad"),
    successMsg: document.getElementById("success_message"),
    regresarBtn: document.getElementById("btn_regresar"),
    enviarFacturaBtn: document.getElementById("enviar_factura"),
  },

  actualizarResumen() {
    const subtotal = Carrito.items.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    if (Carrito.items.length > 0) {
      this.elementos.totalBar.style.marginBottom = "0px";
      document.getElementById("subtotal_text").textContent = `Subtotal: $${subtotal.toFixed(2)}`;
      document.getElementById("iva_text").textContent = `IVA (16%): $${iva.toFixed(2)}`;
      this.elementos.totalText.textContent = `Total: $${total.toFixed(2)}`;
    } else {
      this.elementos.totalBar.style.marginBottom = "-100px";
      document.getElementById("subtotal_text").textContent = `Subtotal: $0.00`;
      document.getElementById("iva_text").textContent = `IVA (16%): $0.00`;
      this.elementos.totalText.textContent = "Total: $0.00";
    }

    this.elementos.registrarVentaBtn.disabled = Carrito.items.length === 0;
  },

  actualizarModal() {
    const ticketList = this.elementos.ticketList;
    ticketList.innerHTML = "";

    if (Carrito.items.length === 0) {
      ticketList.innerHTML = "<p>No hay productos seleccionados.</p>";
    } else {
      Carrito.items.forEach(item => {
        const subtotalItem = item.precio * item.cantidad;
        const divItem = document.createElement("div");
        divItem.classList.add("ticket_item");
        divItem.innerHTML = `
          <div class="desc">${item.nombre}</div>
          <div class="qty">${item.cantidad}</div>
          <div class="price">$${item.precio.toFixed(2)}</div>
          <div class="subtotal">$${subtotalItem.toFixed(2)}</div>
        `;
        ticketList.appendChild(divItem);
      });
    }

    const subtotal = Carrito.items.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
    const iva = subtotal * 0.16;
    const totalModal = subtotal + iva;
    this.elementos.modalSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    this.elementos.modalIva.textContent = `$${iva.toFixed(2)}`;
    this.elementos.modalTotal.textContent = `$${totalModal.toFixed(2)}`;
  },
};




// Modal y eventos
const Modal = {
  mostrarVentaModal() {
    UI.actualizarModal();
    UI.elementos.ventaModal.style.display = "block";
    UI.elementos.modalOverlay.style.display = "block";
  },

  ocultarVentaModal() {
    UI.elementos.ventaModal.style.display = "none";
    UI.elementos.modalOverlay.style.display = "none";
  },

  mostrarFacturacionModal() {
    UI.elementos.facturacionModal.style.display = "block";
  },

  ocultarFacturacionModal() {
    UI.elementos.facturacionModal.style.display = "none";
  },
};




const Venta = {
    enviar(datosFactura = null) {
        console.log("Enviando datos de venta...");

        const formData = new FormData();
        formData.append("productos", JSON.stringify(Carrito.items));
        formData.append("total", Carrito.total);

        console.log("Datos de formData:", formData);
        console.log("Datos de carrito:", formData.get("productos"));
        console.log("Total de carrito:", formData.get("total"));

        if (datosFactura) {
            formData.append("nombre", datosFactura.nombre);
            formData.append("rfc", datosFactura.rfc);
            formData.append("direccion", datosFactura.direccion);
        }

        console.log(formData);

        fetch(registrarVentaUrl, {
            method: "POST",
            headers: {
                "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value,
            },
            body: formData,
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === "success") {
                window.location.reload();
            } else {
                console.error("Error en venta:", data.message);
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
    },

    resetVentaEstado() {
        Modal.ocultarVentaModal();
        Modal.ocultarFacturacionModal();

        UI.elementos.facturaForm.style.display = "none";
        
        UI.elementos.productos.forEach(producto => {
            const cantidadSpan = producto.querySelector(".cantidad");
            cantidadSpan.textContent = 0;
        });


        Carrito.limpiar();
        UI.actualizarResumen();
        Facturacion.clearFacturacion();

        // Make sure the Confirmar and Cancelar buttons are back visible for next usage
        UI.elementos.confirmarVentaBtn.style.display = "inline-block";
        UI.elementos.cancelarVentaBtn.style.display = "inline-block";
    }
};




const Facturacion = {

    noFacturar() {
        Modal.ocultarFacturacionModal();

        Modal.mostrarVentaModal();

        UI.elementos.confirmarVentaBtn.style.display = "none";
        UI.elementos.cancelarVentaBtn.style.display = "none";

        UI.elementos.successMsg.style.display = "block";
        UI.elementos.regresarBtn.style.display = "block";
        
        // Regresar button click handler: close modal & reset
        UI.elementos.regresarBtn.addEventListener("click", function() {
            Venta.resetVentaEstado();
        });
    },

    siFacturar() {
        UI.elementos.facturacionModal.style.display = "none";
        UI.elementos.facturaForm.style.display = "block";

        UI.elementos.enviarFacturaBtn.addEventListener("click", Facturacion.enviarFactura);
    },

    clearFacturacion() {
        // if (UI.elementos.facturaForm) {
        //     UI.elementos.facturaForm.reset();
        // }
        if(UI.elementos.successMsg) {
            UI.elementos.successMsg.style.display = "none";
        }
        if (UI.elementos.regresarBtn) {
            UI.elementos.regresarBtn.style.display = "none";
        }
    },

    enviarFactura(e) {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value;
        const rfc = document.getElementById("rfc").value;
        const direccion = document.getElementById("direccion").value;

        if (!nombre || !rfc || !direccion) {
            alert("Por favor completa todos los campos de facturación.");
            return;
        }

        UI.elementos.facturaForm.style.display = "none";
        UI.elementos.ventaModal.style.display = "none";
        UI.elementos.facturacionModal.style.display = "none";
        UI.elementos.modalOverlay.style.display = "none";

        Venta.enviar({ nombre, rfc, direccion });
        
        Venta.resetVentaEstado();
    }
};



// Inicialización
function init() {
    UI.elementos.productos.forEach(producto => {
        const id = producto.dataset.id;
        const precio = parseFloat(producto.dataset.precio);
        const nombre = producto.querySelector("h3").textContent;

        const btnSumar = producto.querySelector(".sumar");
        const btnRestar = producto.querySelector(".restar");
        const cantidadSpan = producto.querySelector(".cantidad");

        btnSumar.addEventListener("click", () => {
        Carrito.agregarProducto(id, nombre, precio);
        cantidadSpan.textContent = Carrito.items.find(p => p.id === id).cantidad;
        UI.actualizarResumen();
        });

        btnRestar.addEventListener("click", () => {
        Carrito.quitarProducto(id);
        const item = Carrito.items.find(p => p.id === id);
        cantidadSpan.textContent = item ? item.cantidad : 0;
        UI.actualizarResumen();
        });
    });

    UI.elementos.registrarVentaBtn.addEventListener("click", function() {
        UI.actualizarModal();
        Modal.mostrarVentaModal();
    });

    UI.elementos.cancelarVentaBtn.addEventListener("click", Venta.resetVentaEstado);
    
    UI.elementos.confirmarVentaBtn.addEventListener("click", function() {
        UI.elementos.ventaModal.style.display = "none";
        Modal.mostrarFacturacionModal();
    });
    UI.elementos.cancelarPagarBtn.addEventListener("click", Venta.resetVentaEstado);

    UI.elementos.facturarNoBtn.addEventListener("click", Facturacion.noFacturar);
    UI.elementos.facturarSiBtn.addEventListener("click", Facturacion.siFacturar);

}

init();
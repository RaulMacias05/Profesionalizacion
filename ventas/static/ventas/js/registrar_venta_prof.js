const productos = document.querySelectorAll(".producto");
const totalBar = document.getElementById("venta_container");
const totalText = document.getElementById("total_text");
const registrarVentaBtn = document.getElementById("btn_registrar_venta");
const cancelarPagarBtn = document.getElementById("btn_cancelar_venta");
const confirmarVentaBtn = document.getElementById("confirmar_venta");
const ventaForm = document.getElementById("venta_form");
const ventaModal = document.getElementById("venta_modal");
const modalOverlay = document.getElementById("modal_overlay");
const cancelarVentaBtn = document.getElementById("cancelar_venta");
const ticketList = document.getElementById("ticket_list");
const modalSubtotal = document.getElementById("modal_subtotal");
const modalIva = document.getElementById("modal_iva");
const modalTotal = document.getElementById("modal_total");
const facturacionModal = document.getElementById("facturacion_modal");
const facturarSiBtn = document.getElementById("facturar_si");
const facturarNoBtn = document.getElementById("facturar_no");
const facturaForm = document.getElementById("factura_form");
const enviarFacturaBtn = facturaForm.querySelector("button[type='submit']");

let carrito = [];
let total = 0;

productos.forEach(producto => {
  const id = producto.dataset.id;
  const precio = parseFloat(producto.dataset.precio);
  const nombre = producto.querySelector("h3").textContent;

  const btnSumar = producto.querySelector(".sumar");
  const btnRestar = producto.querySelector(".restar");
  const cantidadSpan = producto.querySelector(".cantidad");

  btnSumar.addEventListener("click", function () {
    let item = carrito.find(p => p.id === id);
    if (item) {
      item.cantidad += 1;
    } else {
      carrito.push({
        id,
        cantidad: 1,
        precio,
        nombre
      });
    }
    cantidadSpan.textContent = carrito.find(p => p.id === id).cantidad;
    actualizarResumen();
  });

  btnRestar.addEventListener("click", function () {
    let item = carrito.find(p => p.id === id);
    if (item) {
      item.cantidad -= 1;
      if (item.cantidad <= 0) {
        carrito = carrito.filter(p => p.id !== id);
        cantidadSpan.textContent = 0;
      } else {
        cantidadSpan.textContent = item.cantidad;
      }
      actualizarResumen();
    }
  });
});

function actualizarResumen() {
  const subtotal = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
  const iva = subtotal * 0.16;
  total = subtotal + iva;

  if (carrito.length > 0) {
    totalBar.style.marginBottom = "0px";
    document.getElementById("subtotal_text").textContent = `Subtotal: $${subtotal.toFixed(2)}`;
    document.getElementById("iva_text").textContent = `IVA (16%): $${iva.toFixed(2)}`;
    totalText.textContent = `Total: $${total.toFixed(2)}`;
  } else {
    totalBar.style.marginBottom = "-100px";
    document.getElementById("subtotal_text").textContent = `Subtotal: $0.00`;
    document.getElementById("iva_text").textContent = `IVA (16%): $0.00`;
    totalText.textContent = "Total: $0.00";
  }
}

function actualizarModal() {
  ticketList.innerHTML = "";
  if(carrito.length === 0) {
    ticketList.innerHTML = "<p>No hay productos seleccionados.</p>";
  } else {
    carrito.forEach(item => {
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

  const subtotal = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
  const iva = subtotal * 0.16;
  const totalModal = subtotal + iva;
  modalSubtotal.textContent = `$${subtotal.toFixed(2)}`;
  modalIva.textContent = `$${iva.toFixed(2)}`;
  modalTotal.textContent = `$${totalModal.toFixed(2)}`;

  // Remove success state UI if exists
  removeSuccessMessage();
  // Show the original Confirmar and Cancelar buttons
  confirmarVentaBtn.style.display = "inline-block";
  cancelarVentaBtn.style.display = "inline-block";

  // Remove custom Regresar button if it exists
  const regresarBtn = document.getElementById("btn_regresar");
  if(regresarBtn) {
    regresarBtn.remove();
  }
}

registrarVentaBtn.addEventListener("click", function () {
  actualizarModal();
  ventaModal.style.display = "block";
  modalOverlay.style.display = "block";
});

cancelarPagarBtn.addEventListener("click", function () {
  resetVentaEstado();
  // reload the page to reset the state
});

confirmarVentaBtn.addEventListener("click", function () {
  ventaModal.style.display = "none";
  facturacionModal.style.display = "block";
});

// Handler for facturar No; shows success message and Regresar button
facturarNoBtn.addEventListener("click", function () {
  facturacionModal.style.display = "none";
  facturaForm.style.display = "none";

  ventaModal.style.display = "block";
  modalOverlay.style.display = "block";

  // Clear ticket list (hide products)
  ticketList.innerHTML = "";

  // Hide Confirmar and Cancelar buttons
  confirmarVentaBtn.style.display = "none";
  cancelarVentaBtn.style.display = "none";

  // Add success message if not already present
  let successMsg = document.getElementById("success_message");
  if(!successMsg) {
    successMsg = document.createElement("div");
    successMsg.id = "success_message";
    successMsg.style.marginTop = "20px";
    successMsg.style.fontSize = "18px";
    successMsg.style.fontWeight = "bold";
    successMsg.style.color = "green";
    successMsg.textContent = "Compra exitosa";
    ventaModal.appendChild(successMsg);
  }

  // Add Regresar button if not already present
  let regresarBtn = document.getElementById("btn_regresar");
  if(!regresarBtn) {
    regresarBtn = document.createElement("button");
    regresarBtn.id = "btn_regresar";
    regresarBtn.textContent = "Regresar";
    // Style similarly to the cancelarVentaBtn
    regresarBtn.style.marginTop = "15px";
    regresarBtn.style.padding = "8px 15px";
    regresarBtn.style.fontSize = "16px";
    regresarBtn.style.cursor = "pointer";
    regresarBtn.style.backgroundColor = "#f44336";  // Red similar to cancel
    regresarBtn.style.color = "white";
    regresarBtn.style.border = "none";
    regresarBtn.style.borderRadius = "4px";
    regresarBtn.style.display = "inline-block";

    ventaModal.appendChild(regresarBtn);

    // Regresar button click handler: close modal & reset
    regresarBtn.addEventListener("click", function() {
      resetVentaEstado();
    });
  }

  // Clear carrito and resumen for new state
  carrito = [];
  total = 0;
  actualizarResumen();
  clearFormulario();
});

// Si elige "Sí" → mostrar formulario de facturación
facturarSiBtn.addEventListener("click", function () {
  facturacionModal.style.display = "none";
  facturaForm.style.display = "block";
});

// Cuando se envía el formulario de facturación
enviarFacturaBtn.addEventListener("click", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const rfc = document.getElementById("rfc").value;
  const direccion = document.getElementById("direccion").value;

  if (!nombre || !rfc || !direccion) {
    alert("Por favor completa todos los campos de facturación.");
    return;
  }

  facturaForm.style.display = "none";
  ventaModal.style.display = "none";
  facturacionModal.style.display = "none";
  modalOverlay.style.display = "none";

  carrito = [];
  total = 0;
  actualizarResumen();
  clearFormulario();
  enviarVenta({ nombre, rfc, direccion });
});

function enviarVenta(datosFactura = null) {
  const formData = new FormData(ventaForm);
  formData.append("productos", JSON.stringify(carrito));
  formData.append("total", total);

  if (datosFactura) {
    formData.append("nombre", datosFactura.nombre);
    formData.append("rfc", datosFactura.rfc);
    formData.append("direccion", datosFactura.direccion);
  }

  fetch("{% url 'ventas:registrar_venta' %}", {
    method: "POST",
    headers: {
      "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value
    },
    body: formData
  })
  .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json(); // Intenta convertir la respuesta a JSON
    })
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
}

function clearFormulario() {
  if (facturaForm) {
    facturaForm.reset();
  }
}

function removeSuccessMessage() {
  const successMsg = document.getElementById("success_message");
  if(successMsg) {
    successMsg.remove();
  }
}

function resetVentaEstado() {
  ventaModal.style.display = "none";
  facturacionModal.style.display = "none";
  facturaForm.style.display = "none";
  modalOverlay.style.display = "none";
  
  productos.forEach(producto => {
    const cantidadSpan = producto.querySelector(".cantidad");
    cantidadSpan.textContent = 0;
  });


  carrito = [];
  total = 0;
  actualizarResumen();
  clearFormulario();

  // Remove success message and regresar button from modal
  removeSuccessMessage();
  const regresarBtn = document.getElementById("btn_regresar");
  if(regresarBtn) {
    regresarBtn.remove();
  }

  // Make sure the Confirmar and Cancelar buttons are back visible for next usage
  confirmarVentaBtn.style.display = "inline-block";
  cancelarVentaBtn.style.display = "inline-block";
}

function actualizarRegistrarVentaBtnState() {
  if(carrito.length === 0) {
    registrarVentaBtn.disabled = true;
  } else {
    registrarVentaBtn.disabled = false;
  }
}

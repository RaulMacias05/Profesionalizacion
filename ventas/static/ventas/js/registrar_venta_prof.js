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

let carrito = [];
let total = 0;

productos.forEach(producto => {
  const id = producto.dataset.id;
  const precio = parseFloat(producto.dataset.precio);
  const nombre = producto.querySelector("h3").textContent; // *** CAMBIO: agrego el nombre del producto aquí ***

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
        nombre // *** CAMBIO: guardo el nombre en carrito ***
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
  // Limpiar lista anterior
  ticketList.innerHTML = "";
  if(carrito.length === 0) {
    ticketList.innerHTML = "<p>No hay productos seleccionados.</p>";
  } else {
    // Crear items con nombre, cantidad, precio unitario y subtotal
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
}

registrarVentaBtn.addEventListener("click", function () {
  actualizarModal(); // *** CAMBIO: agregar llamada para actualizar info del modal antes de mostrarlo ***
  // Mostrar el modal y la superposición modal
  ventaModal.style.display = "block";
  modalOverlay.style.display = "block";
});

cancelarPagarBtn.addEventListener("click", function () {
  carrito = [];
  total = 0;
  actualizarResumen();
  ventaModal.style.display = "none";
  modalOverlay.style.display = "none";
});

confirmarVentaBtn.addEventListener("click", function () {
  const formData = new FormData(ventaForm);
  formData.append("productos", JSON.stringify(carrito));
  formData.append("total", total);
  fetch("{% url 'ventas:registrar_venta' %}", {
    method: "POST",
    headers: {
      "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value
    },
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        alert(data.message);
        window.location.reload();
      } else {
        alert("Error: " + data.message);
      }
    })
    .catch(error => console.error("Error:", error));
});

cancelarVentaBtn.addEventListener("click", function () {
  ventaModal.style.display = "none";
  modalOverlay.style.display = "none";
});

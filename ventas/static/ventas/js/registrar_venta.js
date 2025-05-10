const searchInput = document.getElementById("search");
const productos = document.querySelectorAll(".producto");
const totalBar = document.getElementById("venta_container");
const totalText = document.getElementById("total_text");
const registrarVentaBtn = document.getElementById("btn_registrar_venta");
const confirmarVentaBtn = document.getElementById("confirmar_venta");
const ventaForm = document.getElementById("venta_form");
const ventaModal = document.getElementById("venta_modal");
const modalOverlay = document.getElementById("modal_overlay");
const cancelarVentaBtn = document.getElementById("cancelar_venta");
const cambioText = document.getElementById("cambio_text");
const montoPagado = document.getElementById("id_monto_pagado");

let selectedProducts = [];
let total = 0;

// Filtrar productos por nombre
searchInput.addEventListener("input", function () {
  const searchTerm = searchInput.value.toLowerCase();
  productos.forEach(producto => {
    const nombre = producto.querySelector("h3").textContent.toLowerCase();
    producto.style.display = nombre.includes(searchTerm) ? "block" : "none";
  });
});

let orderCounter = -productos.length - 1; // Contador para el orden de los productos seleccionados, 
                                          // empieza con la cantidad de productos al negativo para 
                                          // que el primer producto seleccionado se vaya hasta arriba

// Seleccionar productos y actualizar total
productos.forEach(prod => {
  prod.addEventListener("click", function () {
    const id_prod = prod.dataset.id;
    const precio = parseFloat(prod.querySelector("p").textContent.replace("Precio: $", ""));
    const producto = document.getElementById("prod_" + id_prod);

    if (producto.classList.contains("selected")) {
      producto.classList.remove("selected");
      producto.style.border = "none";
      producto.style.order = "";
      orderCounter--; // Cuando se deselecciona, se resta 1 al contador.
                      // Sin esto, el contador seguiría aumentando
                      // y los productos seleccionados se irían al final de la lista.
      selectedProducts = selectedProducts.filter(id => id !== id_prod); // Si el producto ya estaba seleccionado, lo eliminamos de la lista de productos seleccionados
      total -= precio;
    } else {
      producto.classList.add("selected");
      producto.style.border = "1px solid rgb(116, 255, 116)";
      producto.style.order = "-1"
      producto.style.order = orderCounter++; // Cuando el primero se selecciona, se manda al inicio de la lista de todos los productos.
                                             // Cuando se selecciona otro, se manda al final de la lista, pero de los productos seleccionados.
      selectedProducts.push(id_prod);
      total += precio;
    }
    console.log(orderCounter);

    // Actualizar barra de total
    if (selectedProducts.length > 0) {
      totalBar.style.marginBottom = "0px";
      totalText.textContent = `Total: $${total.toFixed(2)}`;
    } else {
      totalBar.style.marginBottom = "-100px";
    }
  });
});

// Enviar los datos al servidor al hacer clic en el botón de registrar venta
registrarVentaBtn.addEventListener("click", function () {
  if (selectedProducts.length === 0) {
    alert("No has seleccionado ningún producto.");
    return;
  }

  // Mostrar el modal de venta
  ventaModal.style.display = "block";
  modalOverlay.style.display = "block";
});

montoPagado.addEventListener("input", function () {
  // Obtener el valor del input y eliminar espacios en blanco
  const inputValue = montoPagado.value.trim();

  // Convertir el valor a un número flotante, eliminando el símbolo "$" si está presente
  const monto = parseFloat(inputValue ? inputValue.replace("$", "") : 0);

  // Verificar si el valor es un número válido
  if (!isNaN(monto)) {
    // Calcular el cambio
    const cambioFinal = monto - total;

    // Actualizar el texto del cambio
    cambioText.textContent = `Cambio: $${cambioFinal.toFixed(2)}`;
  } else {
    // Si el valor no es válido, mostrar $0.00 como cambio
    cambioText.textContent = "Cambio: $0.00";
  }
});

// Mostrar el modal de venta
confirmarVentaBtn.addEventListener("click", function () {
  const formData = new FormData(ventaForm);
  formData.append("productos", JSON.stringify(selectedProducts));
  formData.append("total", total);

  fetch(registrarVentaUrl, {
    method: "POST",
    headers: {
      "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value
    },
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        alert(data.message);
        window.location.reload(); // Recargar la página después de registrar la venta
      } else {
        alert("Error al registrar la venta: " + data.message);
      }
    })
    .catch(error => console.error("Error:", error));
});

// Cerrar el modal de venta
cancelarVentaBtn.addEventListener("click", function () {
  ventaModal.style.display = "none";
  modalOverlay.style.display = "none";
});
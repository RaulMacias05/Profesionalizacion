const searchInput = document.getElementById("search");
const productos = document.querySelectorAll(".producto");

searchInput.addEventListener("input", function () {
  const searchTerm = searchInput.value.toLowerCase();

  productos.forEach(producto => {
    const nombreProducto = producto.querySelector("h3").textContent.toLowerCase();
    const descripcionProducto = producto.querySelector("p").textContent.toLowerCase();

    // Verifica si el término de búsqueda coincide con el nombre o la descripción
    if (nombreProducto.includes(searchTerm) || descripcionProducto.includes(searchTerm)) {
      producto.style.display = ""; // Muestra el producto
    } else {
      producto.style.display = "none"; // Oculta el producto
    }
  });
});
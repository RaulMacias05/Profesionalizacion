const searchInput = document.getElementById("search");
const ventasTableBody = document.getElementById("ventas_table_body");
const ventasRows = ventasTableBody.querySelectorAll(".venta");
const productos = ventasTableBody.querySelectorAll(".productos");

searchInput.addEventListener("input", function () {
  const searchTerm = searchInput.value.toLowerCase();
  ventasRows.forEach(row => {
    const cells = row.querySelectorAll("td");
    let found = false;
    cells.forEach(cell => {
      if (cell.textContent.toLowerCase().includes(searchTerm)) {
        found = true;
      }
    });
    if (found) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
});

productos.forEach(producto => {
  if (producto.children.length > 1) {
    producto.style.justifyContent = "flex-start";
    producto.style.borderBottom = "1px solid var(--header-bg-color)";
  }
});
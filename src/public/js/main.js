const socket = io();

// Escuchar el evento 'productList' y actualizar la lista de productos
socket.on("allProducts", (products) => {

  const productList = document.getElementById("productList");
  productList.innerHTML = "";

  products.forEach((product) => {

    const listItem = document.createElement("li");
    listItem.textContent = `${product.id} - ${product.title} - ${product.code} - ${product.price} - ${product.stock} - ${product.category}`;
    productList.appendChild(listItem);

  });
});

const newProductForm = document.getElementById('newProductForm');

newProductForm.addEventListener('submit', event => {

    event.preventDefault();
    const title = newProductForm.elements.title.value;
    const description = newProductForm.elements.description.value;
    const code = newProductForm.elements.code.value;
    const price = newProductForm.elements.price.value;
    const stock = newProductForm.elements.stock.value;
    const category = newProductForm.elements.category.value;
    const thumbnail = newProductForm.elements.thumbnail.files[0];

    const boolString = "true"; 
    const boolStatus = (boolString === "true"); //returns true

    // Crear un objeto FormData para enviar los datos
    const formData = {
      title: title,
      description: description,
      code: code,
      price: price,
      status: boolStatus,
      stock: stock,
      category: category,
      thumbnail: thumbnail
    }
    
    // Enviar los datos por el FormData
    socket.emit('addProduct', formData); 
    newProductForm.reset();

  });

// Enviar el evento 'deleteProduct' cuando se envíe el formulario de eliminación de productos
const deleteProductForm = document.getElementById("deleteProductForm");

deleteProductForm.addEventListener("submit", (event) => {

  event.preventDefault();
  const productId = deleteProductForm.elements.productId.value;
  socket.emit("deleteProduct", productId);
  deleteProductForm.reset();

});
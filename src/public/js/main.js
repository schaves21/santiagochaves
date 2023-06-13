const socket = io();

socket.on("allProducts", (products) => {
  const productList = document.getElementById("productList");
  productList.innerHTML = "";

  products.forEach((product) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${product.id} - ${product.title} - ${product.code} - ${product.price} - ${product.stock} - ${product.category}`;
    productList.appendChild(listItem);
  });
});

const newProductForm = document.getElementById("newProductForm");

newProductForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = newProductForm.elements.title.value;
  const description = newProductForm.elements.description.value;
  const code = newProductForm.elements.code.value;
  const price = newProductForm.elements.price.value;
  const stock = newProductForm.elements.stock.value;
  const category = newProductForm.elements.category.value;
  const thumbnail = newProductForm.elements.thumbnail.files[0];

  const boolString = "true";
  const boolStatus = boolString === "true";

  const formData = {
    title: title,
    description: description,
    code: code,
    price: price,
    status: boolStatus,
    stock: stock,
    category: category,
    thumbnail: thumbnail,
  };

  socket.emit("addProduct", formData);
  newProductForm.reset();
});

const deleteProductForm = document.getElementById("deleteProductForm");

deleteProductForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const productId = deleteProductForm.elements.productId.value;
  socket.emit("deleteProduct", productId);
  deleteProductForm.reset();
});

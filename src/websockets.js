import { Server } from "socket.io";
import productManager from "./classes/productmanager.js";

const myProducts = new productManager("./src/data/products.json");

const configureWebSockets = (httpserver) => {

  const io = new Server(httpserver);

  // Configurar eventos de Socket.io
  io.on("connection", (socket) => {

    console.log(`New client connected: ${socket.id}`);

    // Evento para emitir la lista de productos actualizada a los clientes
    const emitProductList = async () => {

      const products = await myProducts.getProducts();
      socket.emit("allProducts", products);

    };

    // Emitir la lista de productos al cliente recién conectado
    emitProductList();

    // Escuchar el evento de creación de un nuevo producto
    socket.on("addProduct", async (product) => {

      try {

        await myProducts.addProduct(product);
        emitProductList();

      } catch (error) {

        console.error("Error creating the product:", error);

      }

    });

    // Escuchar el evento de eliminación de un producto
    socket.on("deleteProduct", async (Id) => {

      await myProducts.deleteProduct(Id);
      emitProductList();

    });

    // Manejar la desconexión del cliente
    socket.on("disconnect", () => {

      console.log("Client disconnected");

    });
    
  });

};

export default configureWebSockets;
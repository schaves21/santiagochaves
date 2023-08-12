import { Server } from 'socket.io';
import { MsgMongoose } from '../DAO/mongo/schemas/messages.mongoose.js';
import { productsMemory } from '../DAO/memory/products.memory.js';

//import productManager from '../DAO/memory/products.memory.js';
//const myProducts = new productsMemory('./src/data/products.json');

export const connectWebSockets = (httpServer) => {
  const io = new Server(httpServer);

  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    const emitProductList = async () => {
      //const products = await myProducts.getProducts();
      const products = await productsMemory.getProducts();
      socket.emit('allProducts', products);
    };

    emitProductList();

    socket.on('addProduct', async (product) => {
      try {
        //await myProducts.addProduct(product);
        await productsMemory.addProduct(product);
        emitProductList();
      } catch (error) {
        console.error('Error creating the product:', error);
      }
    });

    socket.on('deleteProduct', async (Id) => {
      //await myProducts.deleteProduct(Id);
      await productsMemory.deleteProduct(Id);
      emitProductList();
    });

    socket.on('msg_chat_front_to_back', async (msg) => {
      try {
        await MsgMongoose.create(msg);
      } catch (e) {
        console.log(e);
      }

      try {
        const msgs = await MsgMongoose.find({});
        socket.emit('listado_de_msgs', msgs);
      } catch (e) {
        console.log(e);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};

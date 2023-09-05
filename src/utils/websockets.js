import { Server } from 'socket.io';
import { MsgMongoose } from '../DAO/mongo/schemas/messages.mongoose.js';
import ProductModel from '../DAO/memory/products.memory.js';
import { logger } from '../utils/logger.js';

const productModel = new ProductModel();

export const connectWebSockets = (httpServer) => {
  const io = new Server(httpServer);

  io.on('connection', (socket) => {
    logger.info(`New client connected: ${socket.id}`);

    const emitProductList = async () => {
      const products = await productModel.getProducts();
      socket.emit('allProducts', products);
    };

    emitProductList();

    socket.on('addProduct', async (product) => {
      try {
        await productModel.addProduct(product);
        emitProductList();
      } catch (err) {
        logger.error(err);
      }
    });

    socket.on('deleteProduct', async (Id) => {
      await productModel.deleteProduct(Id);
      emitProductList();
    });

    socket.on('msg_chat_front_to_back', async (msg) => {
      try {
        await MsgMongoose.create(msg);
      } catch (err) {
        logger.error(err);
      }

      try {
        const msgs = await MsgMongoose.find({});
        socket.emit('listado_de_msgs', msgs);
      } catch (err) {
        logger.error(err);
      }
    });

    socket.on('disconnect', () => {
      logger.info('Client disconnected');
    });
  });
};

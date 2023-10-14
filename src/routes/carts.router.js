import express from 'express';
import { checkUser, checkCart } from '../middlewares/auth.js';
import { cartController } from '../controllers/carts.controller.js';
import { ticketController } from '../controllers/tickets.controller.js';

export const cartsRouter = express.Router();

cartsRouter.get('/', checkUser, cartController.getAllCarts);
cartsRouter.get('/:cid', checkUser, cartController.getCartById);
cartsRouter.post('/', checkUser, cartController.create);
cartsRouter.post('/:cid/products/:pid', checkUser, checkCart, cartController.addProductCart);
cartsRouter.put('/:cid', checkUser, cartController.updateCart);
cartsRouter.put('/:cid/products/:pid', checkUser, cartController.updateProductQuantity);
cartsRouter.delete('/:cid/products/:pid', checkUser, cartController.removeProduct);
cartsRouter.delete('/:cid', checkUser, cartController.clearCart);
cartsRouter.post('/:cid/purchase', checkUser, ticketController.createTicket);

import express from 'express';
import { checkUser, checkCart } from '../middlewares/auth.js';
import { cartController } from '../controllers/carts.controller.js';
import { ticketController } from '../controllers/tickets.controller.js';

export const cartsRouter = express.Router();

// ----------- MongoDB -------------------------------

// **** para postman / thunder client quitar el middleware checkUser ***
//cartsRouter.get('/', cartController.getAll);
//cartsRouter.get('/:cid', cartController.getCartById);
//cartsRouter.post('/:cid/product/:pid', cartController.addProductCart);
//cartsRouter.put('/:cid', cartController.updateCart);
//cartsRouter.put('/:cid/products/:pid', cartController.updateProductQuantity);
//cartsRouter.delete('/:cid/products/:pid', cartController.removeProduct);
//cartsRouter.delete('/:cid', cartController.clearCart);

cartsRouter.get('/', checkUser, cartController.getAll);
cartsRouter.get('/:cid', checkUser, cartController.getCartById);
cartsRouter.post('/', checkUser, cartController.create);
cartsRouter.post('/:cid/product/:pid', checkUser, checkCart, cartController.addProductCart);
cartsRouter.put('/:cid', checkUser, cartController.updateCart);
cartsRouter.put('/:cid/products/:pid', checkUser, cartController.updateProductQuantity);
cartsRouter.delete('/:cid/products/:pid', checkUser, cartController.removeProduct);
cartsRouter.delete('/:cid', checkUser, cartController.clearCart);
cartsRouter.post('/:cid/purchase', ticketController.createTicket);

/* ------------- FileSystem -----------------------------------

import cart from "../dao/cart.js";

const oneCart = new cart();

cartsRouter.get("/", async (req, res) => {
  res.send(await oneCart.readCarts());
});

cartsRouter.post("/", async (req, res) => {
  res.send(await oneCart.addCart());
});

cartsRouter.get("/:cid", async (req, res) => {
  res.send(await oneCart.getCartById(req.params.cid));
});

cartsRouter.post("/:cid/products/:pid", async (req, res) => {
  let cartId = req.params.cid;
  let productId = req.params.pid;

  res.send(await oneCart.addProductCart(cartId, productId));
});

*/

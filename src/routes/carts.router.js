import { cartService } from "../services/carts.service.js";
import express from "express";

export const cartsRouter = express.Router();

// ----------- MongoDB -------------------------------
cartsRouter.get("/", async (req, res) => {
  try {
    const carts = await cartService.getAll();
    return res.status(200).json({
      status: "success",
      msg: "Carts list",
      payload: carts,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "Something went wrong :(",
      payload: {},
    });
  }
});

cartsRouter.post("/", async (req, res) => {
  try {
    const cartCreated = await cartService.addProductCart({
      products: [],
      quantity: 1,
    });
    console.log(cartCreated);
    return res.status(201).json({
      status: "success",
      msg: "Product created",
      payload: {
        _id: cartCreated._id,
        quantity: cartCreated.quantity,
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "Something went wrong :(",
      payload: {},
    });
  }
});

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

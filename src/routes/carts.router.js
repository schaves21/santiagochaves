import { cartService } from "../services/carts.service.js";
import express from "express";

export const cartsRouter = express.Router();

// ----------- MongoDB -------------------------------

cartsRouter.get("/", async (req, res) => {
  try {
    //const cartId = req.params.cid;
    const cart = await cartService.getAll();
    res.status(200).json(cart);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

cartsRouter.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartService.getCartById(cartId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

cartsRouter.post("/", async (req, res) => {
  try {
    const newCart = await cartService.createOne();
    res.status(201).json(newCart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartService.addProductCart(cid, pid);
    res.status(200).json(cart);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

cartsRouter.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    const cart = await cartService.updateCart(cid, products);
    res
      .status(200)
      .json({ status: "success", message: "Cart updated successfully", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

cartsRouter.put("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await cartService.updateProductQuantity(cid, pid, quantity);
    res
      .status(200)
      .json({ status: "success", message: "Product quantity updated", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

cartsRouter.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartService.removeProduct(cid, pid);
    res
      .status(200)
      .json({ status: "success", message: "Product removed from cart", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

cartsRouter.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    await cartService.clearCart(cid);
    res
      .status(200)
      .json({ status: "success", message: "Cart cleared successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
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

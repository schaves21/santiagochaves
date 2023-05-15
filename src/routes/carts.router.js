import express from "express";
import cart from "../classes/cart.js";

export const cartsRouter = express.Router();

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
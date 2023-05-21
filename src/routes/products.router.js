import express from "express";
import productManager from "../classes/productmanager.js";

export const productsRouter = express.Router();
const productM = new productManager();


productsRouter.get("/", async (req, res) => {

  let limit = parseInt(req.query.limit);

  if(!limit) {
    return res.send(await productM.getProducts());
  }  

  let readProduct = await productM.getProducts();
  let productLimit = readProduct.slice(0, limit); 
  res.send(productLimit);

});

productsRouter.get("/:pid", async (req, res) => {

  let id = req.params.pid;
  res.send(await productM.getProductById(id));

});

productsRouter.post("/", async (req, res) => {

  let postProduct = req.body;
  res.send(await productM.addProduct(postProduct));

});

productsRouter.put("/:pid", async (req, res) => {

  let id = req.params.pid;
  let putProduct = req.body;
  res.send(await productM.updateProduct(id, putProduct));
    
});

productsRouter.delete("/:pid", async (req, res) => {

  let id = req.params.pid;
  res.send(await productM.deleteProduct(id));
    
});


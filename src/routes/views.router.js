import express from "express";
import productManager from "../dao/productmanager.js";

export const viewsRouter = express.Router();
const products = new productManager();

viewsRouter.get("/", async (req, res) => {
  let myProducts = await products.getProducts();
  const title = "Lista de Productos";
  return res.status(200).render("home", {
    title,
    products: myProducts,
  });
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts");
});

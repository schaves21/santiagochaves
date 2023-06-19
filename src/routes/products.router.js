import { productService } from "../services/products.service.js";
import express from "express";

export const productsRouter = express.Router();

// ------------- MongoDB -------------------------------

productsRouter.get("/", async (req, res) => {
  try {
    const queryParams = req.query;
    const response = await productService.get(queryParams);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "Something went wrong :(",
      data: {},
    });
  }
});

productsRouter.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productService.get(pid);
    return res.status(200).json({
      status: "success",
      msg: "Product",
      data: product,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "Something went wrong :(",
      data: {},
    });
  }
});

productsRouter.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    } = req.body;
    const productCreated = await productService.createOne(
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail
    );
    return res.status(201).json({
      status: "success",
      msg: "Product created",
      data: productCreated,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "Something went wrong :(",
      data: {},
    });
  }
});

productsRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    } = req.body;
    if (
      !title ||
      !description ||
      !code ||
      !price ||
      !status ||
      !stock ||
      !category ||
      !thumbnail
    ) {
      console.log("Validation error: please complete all fields.");
      return res.status(400).json({
        status: "error",
        msg: "Validation error: please complete all fields.",
        data: {},
      });
    }

    const productUpdated = await productService.updateOne(
      id,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail
    );
    return res.status(200).json({
      status: "success",
      msg: "Product updated",
      data: productUpdated,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "Something went wrong :(",
      data: {},
    });
  }
});

productsRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const productDeleted = await productService.deleteOne(id);
    return res.status(200).json({
      status: "success",
      msg: "Product deleted",
      data: {},
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "Something went wrong :(",
      data: {},
    });
  }
});

/* --------------- Filesystem ------------------------
import productManager from "../dao/productmanager.js";

const productM = new productManager();

productsRouter.get("/", async (req, res) => {
  let limit = parseInt(req.query.limit);

  if (!limit) {
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

*/

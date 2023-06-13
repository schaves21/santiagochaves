import { productService } from "../services/products.service.js";
import express from "express";

export const productsRouter = express.Router();

// ------------- MongoDB -------------------------------

productsRouter.get("/", async (req, res) => {
  try {
    const products = await productService.getAll();
    return res.status(200).json({
      status: "success",
      msg: "Products list",
      payload: products,
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
      console.log("All fields are required");
      return res.status(400).json({
        status: "error",
        msg: "All fields are required",
        payload: {},
      });
    }
    const productCreated = await productService.create({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    });
    return res.status(201).json({
      status: "success",
      msg: "Product created",
      payload: {
        _id: productCreated._id,
        title: productCreated.title,
        description: productCreated.description,
        code: productCreated.code,
        price: productCreated.price,
        status: productCreated.status,
        stock: productCreated.stock,
        category: productCreated.category,
        thumbnail: productCreated.thumbnail,
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

productsRouter.put("/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
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
      !thumbnail ||
      !_id
    ) {
      console.log("All fields are required");
      return res.status(400).json({
        status: "error",
        msg: "All fields are required",
        payload: {},
      });
    }
    try {
      const productUptaded = await productService.updateOne({
        _id,
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail,
      });
      if (productUptaded.matchedCount > 0) {
        return res.status(201).json({
          status: "success",
          msg: "Product uptaded",
          payload: {},
        });
      } else {
        return res.status(404).json({
          status: "error",
          msg: "Product not found",
          payload: {},
        });
      }
    } catch (e) {
      return res.status(500).json({
        status: "error",
        msg: "DB server error while updating product",
        payload: {},
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "Something went wrong :(",
      payload: {},
    });
  }
});

productsRouter.delete("/:_id", async (req, res) => {
  try {
    const { _id } = req.params;

    const result = await productService.deleteOne(_id);

    if (result?.deletedCount > 0) {
      return res.status(200).json({
        status: "success",
        msg: "Product deleted",
        payload: {},
      });
    } else {
      return res.status(404).json({
        status: "error",
        msg: "Product not found",
        payload: {},
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "Something went wrong :(",
      payload: {},
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

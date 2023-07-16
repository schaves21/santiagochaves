import { cartService } from "../services/carts.service.js";
import express from "express";
import { productModel } from "../dao/models/products.model.js";
import { productService } from "../services/products.service.js";
import { checkUser, checkAdmin } from "../middlewares/auth.js";

export const viewsRouter = express.Router();

/* CODIGO PARA FILESYSTEM
//import productManager from "../dao/productmanager.js";
//const products = new productManager();


viewsRouter.get("/", async (req, res) => {
  let myProducts = await products.getProducts();
  const title = "Lista de Productos";
  return res.status(200).render("home", {
    title,
    products: myProducts,
  });
});

* HASTA ACÁ FILESYSTEM/ 

/* NO SE SI ES ASI PERO, COMENTO ESTA RUTA PARA RESOLVER EL DESAFIO "IMPLEMENTACION DE LOGIN" 
QUE PIDE QUE LA RUTA "/" MUESTRE LA VISTA DEL LOGIN
viewsRouter.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const queryParams = { limit, page, sort, query };
    const {
      payload: products,
      totalPages,
      prevPage,
      nextPage,
      page: currentPage,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,
    } = await productService.get(queryParams);
    let productsViews = products.map((item) => {
      return {
        _id: item._id.toString(),
        title: item.title,
        description: item.description,
        code: item.code,
        price: item.price,
        status: item.status,
        stock: item.stock,
        category: item.category,
        thumbnail: item.thumbnail,
      };
    });
    return res.render("home", {
      status: "success",
      products: productsViews,
      totalPages,
      prevPage,
      nextPage,
      currentPage,
      hasPrevPage,
      hasNextPage,
      prevLink: prevLink?.substring(4) || "",
      nextLink: nextLink?.substring(4) || "",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Error in server" });
  }
});
*/

viewsRouter.get("/", (req, res) => {
  res.render("home");
});

viewsRouter.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.render("error", { error: "could not close the session" });
    }
    return res.redirect("/login");
  });
});

viewsRouter.get("/login", (req, res) => {
  try {
    const title = "Mega-Friday® - Login";
    return res.status(200).render("login", { title });
  } catch (err) {
    console.log(err);
    res.status(501).send({ status: "error", msg: "Server error", error: err });
  }
});

viewsRouter.get("/register", (req, res) => {
  try {
    const title = "Mega-Friday® - Register";
    return res.status(200).render("register", { title });
  } catch (err) {
    console.log(err);
    res.status(501).send({ status: "error", msg: "Server error", error: err });
  }
});

viewsRouter.get("/profile", checkUser, (req, res) => {
  const user = req.session.user;
  res.render("profile", { user: user });
});

viewsRouter.get("/admin", checkUser, checkAdmin, (req, res) => {
  res.send("admin");
});

viewsRouter.get("/products", checkUser, async (req, res) => {
  try {
    const user = req.session.user;

    console.log(user);

    const { limit = 10, page = 1, sort, query } = req.query;
    const queryParams = { limit, page, sort, query };
    const {
      payload: products,
      totalPages,
      prevPage,
      nextPage,
      page: currentPage,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,
    } = await productService.get(queryParams);
    let productsViews = products.map((item) => {
      return {
        _id: item._id.toString(),
        title: item.title,
        description: item.description,
        code: item.code,
        price: item.price,
        status: item.status,
        stock: item.stock,
        category: item.category,
        thumbnail: item.thumbnail,
      };
    });
    return res.render("products", {
      status: "success",
      user: user,
      products: productsViews,
      totalPages,
      prevPage,
      nextPage,
      currentPage,
      hasPrevPage,
      hasNextPage,
      prevLink: prevLink?.substring(4) || "",
      nextLink: nextLink?.substring(4) || "",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Error in server" });
  }
});

viewsRouter.get("/products/:pid", async (req, res, next) => {
  try {
    const { pid } = req.params;
    const product = await productModel.findById(pid);
    const productsViews = {
      _id: product._id.toString(),
      title: product.title,
      description: product.description,
      code: product.code,
      price: product.price,
      status: product.status,
      stock: product.stock,
      category: product.category,
      thumbnail: product.thumbnail,
    };
    res.render("product", { product: productsViews });
  } catch (error) {
    next(error);
  }
});

viewsRouter.get("/carts/:cid", async (req, res, next) => {
  try {
    const { cid } = req.params;
    const cart = await cartService.getCartById(cid);
    const cartsViews = cart.products.map((item) => {
      return {
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
      };
    });
    res.render("cart", { cart: cartsViews });
  } catch (error) {
    next(error);
  }
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts");
});

import express from 'express';
import { viewController } from '../controllers/views.controller.js';
import { checkUser, checkAdmin } from '../middlewares/auth.js';

export const viewsRouter = express.Router();

viewsRouter.get('/', viewController.getHome);
viewsRouter.get('/login', viewController.getLogin);
viewsRouter.get('/menu', viewController.getMenu);
viewsRouter.get('/logout', viewController.getLogout);
viewsRouter.get('/register', viewController.getRegister);
viewsRouter.get('/profile', checkUser, viewController.getProfile);
viewsRouter.get('/admin', checkAdmin, viewController.getAdmin);
viewsRouter.get('/products', viewController.getProducts);
viewsRouter.get('/products/:pid', viewController.viewProductById);
viewsRouter.get('/carts/:cid', viewController.viewCartById);
viewsRouter.get('/realtimeproducts', viewController.getRealTimeProducts);
viewsRouter.get('/chat', checkUser, viewController.getChats);
viewsRouter.get('/crud-products', checkAdmin, viewController.getAllProducts);
viewsRouter.get('/purchase/', viewController.viewPurchaseById);

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

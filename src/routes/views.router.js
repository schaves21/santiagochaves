import express from 'express';
import { viewController } from '../controllers/views.controller.js';
import { checkUser, checkAdmin, checkAdminOrPremium, checkCart } from '../middlewares/auth.js';
import { cartController } from '../controllers/carts.controller.js';
import { ticketController } from '../controllers/tickets.controller.js';

export const viewsRouter = express.Router();

viewsRouter.get('/', viewController.getHome);
viewsRouter.get('/login', viewController.getLogin);
viewsRouter.get('/menu', viewController.getMenu);
viewsRouter.get('/logout', viewController.getLogout);
viewsRouter.get('/register', viewController.getRegister);
viewsRouter.get('/profile', checkUser, viewController.getProfile);
viewsRouter.get('/admin', checkAdmin, viewController.getAdmin);
viewsRouter.get('/products', checkUser, viewController.getProducts);
viewsRouter.get('/products/:pid', checkUser, viewController.viewProductById);
viewsRouter.get('/realtimeproducts', viewController.getRealTimeProducts);
viewsRouter.get('/chat', checkUser, viewController.getChats);

// AGREGAR UN PRODUCTO AL CARRITO EN LA VISTA DE PRODUCTOS HANDLEBARS
viewsRouter.post('/cart/:cid/products/:pid', checkUser, checkCart, cartController.addProductCart);

// RUTAS PARA EL PROCESO DE COMPRA POR WEB
viewsRouter.get('/cart/:cid', checkUser, viewController.viewCartById);
viewsRouter.post('/cart/:cid/purchase', checkUser, checkCart, ticketController.createTicket);
viewsRouter.get('/purchases', viewController.viewPurchaseByEmail);

// CRUD API PRODUCTS USERS ADMIN / PREMIUM
viewsRouter.get('/api-products-menu', checkAdminOrPremium, viewController.viewApiProductsMenu);
viewsRouter.get('/product-by-id', checkAdminOrPremium, viewController.viewApiProductById);
viewsRouter.get('/crud-api-products', checkAdminOrPremium, viewController.viewCrudApiProducts);

// CRUD API CARTS USERS USER
viewsRouter.get('/crud-api-carts', checkUser, viewController.viewApiCartsMenu);

// API TICKETS USERS USER
viewsRouter.get('/api-tickets', checkUser, viewController.viewApiTicketsMenu);

// CRUD PRODUCTS USERS ADMINISTRATOR
viewsRouter.get('/crud-products', checkAdmin, viewController.readProductsView);
viewsRouter.post('/crud-products', checkAdmin, viewController.createProductView);
viewsRouter.post('/crud-products/:pid', checkAdmin, viewController.updateProductView);
viewsRouter.delete('/crud-products/delete/:pid', checkAdmin, viewController.deleteProductView);

// READ UPDATE DELETE USERS ADMINISTRATOR
viewsRouter.get('/crud-users', checkAdmin, viewController.readUsersView);
viewsRouter.post('/crud-users/:uid', checkAdmin, viewController.updateUserRoleView);
viewsRouter.delete('/crud-users/delete/:uid', checkAdmin, viewController.deleteUserView);
viewsRouter.delete('/crud-users/inactive-users', viewController.deleteInactiveUsersView);

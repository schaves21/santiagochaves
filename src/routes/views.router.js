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
viewsRouter.get('/purchase/', viewController.viewPurchaseByEmail);

// CRUD Products Administrator
viewsRouter.get('/crud-products', checkAdmin, viewController.readProductsView);
viewsRouter.post('/crud-products', checkAdmin, viewController.createProductView);
viewsRouter.post('/crud-products/:pid', checkAdmin, viewController.updateProductView);
viewsRouter.delete('/crud-products/delete/:pid', checkAdmin, viewController.deleteProductView);

// Read Update Delete Users Administrator
viewsRouter.get('/crud-users', checkAdmin, viewController.readUsersView);
viewsRouter.post('/crud-users/:uid', checkAdmin, viewController.updateUserRoleView);
viewsRouter.delete('/crud-users/delete/:uid', checkAdmin, viewController.deleteUserView);

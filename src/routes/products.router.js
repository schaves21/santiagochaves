import express from 'express';
import { productController } from '../controllers/products.controller.js';
import { checkAdmin, checkAdminOrPremium } from '../middlewares/auth.js';

export const productsRouter = express.Router();

productsRouter.get('/mockingproducts', checkAdmin, productController.mockingProducts);
productsRouter.get('/', checkAdminOrPremium, productController.getAllProducts);
productsRouter.get('/:pid', checkAdminOrPremium, productController.getProductById);
productsRouter.post('/', checkAdminOrPremium, productController.create);
productsRouter.put('/:pid', checkAdminOrPremium, productController.updateOne);
productsRouter.delete('/:pid', checkAdminOrPremium, productController.deleteOne);

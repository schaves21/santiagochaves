import { CustomError } from '../utils/errors/custom-error.js';
import { EErrors } from '../utils/errors/dictionary-error.js';
import { productService } from '../services/products.service.js';
import ProductDTO from './DTO/products.dto.js';
import { generateProduct } from '../utils/facker.js';

class ProductController {
  async getAllProducts(req, res, next) {
    try {
      const product = await productService.getAllProducts();
      if (!product) {
        throw new CustomError(EErrors.PRODUCT_NOT_FOUND.code, EErrors.PRODUCT_NOT_FOUND.name, EErrors.PRODUCT_NOT_FOUND.cause, EErrors.PRODUCT_NOT_FOUND.message);
      }
      return res.status(200).json({
        status: 'success',
        msg: 'Products list',
        payload: product,
      });
    } catch (err) {
      next(err);
    }
  }

  async getProductById(req, res, next) {
    try {
      const { pid } = req.params;
      const product = await productService.getProductById(pid);

      if (!product) {
        throw new CustomError(EErrors.PRODUCT_NOT_FOUND.code, EErrors.PRODUCT_NOT_FOUND.name, EErrors.PRODUCT_NOT_FOUND.cause, EErrors.PRODUCT_NOT_FOUND.message);
      }

      return res.status(200).json({
        status: 'success',
        msg: 'Product',
        data: product,
      });
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const { title, description, code, price, stock, category, thumbnail } = req.body;

      if (!title || !description || !code || !price || !stock || !category || !thumbnail) {
        throw new CustomError(EErrors.INVALID_INPUT_ERROR.code, EErrors.INVALID_INPUT_ERROR.name, EErrors.INVALID_INPUT_ERROR.cause, EErrors.INVALID_INPUT_ERROR.message);
      }

      let product = new ProductDTO({ title, description, code, price, stock, category, thumbnail });
      const productCreated = await productService.create(product);

      return res.status(201).json({
        status: 'success',
        msg: 'Product created',
        data: productCreated,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateOne(req, res, next) {
    try {
      const { id } = req.params;
      const { title, description, code, price, stock, category, thumbnail } = req.body;

      if (!title || !description || !code || !price || !stock || !category || !thumbnail) {
        throw new CustomError(EErrors.INVALID_INPUT_ERROR.code, EErrors.INVALID_INPUT_ERROR.name, EErrors.INVALID_INPUT_ERROR.cause, EErrors.INVALID_INPUT_ERROR.message);
      }

      let product = new ProductDTO({ title, description, code, price, stock, category, thumbnail });
      const productUpdated = await productService.updateOne(id, product);

      return res.status(200).json({
        status: 'success',
        msg: 'Product updated',
        data: productUpdated,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteOne(req, res, next) {
    try {
      const { id } = req.params;
      const productDeleted = await productService.deleteOne(id);
      return res.status(200).json({
        status: 'success',
        msg: 'Product deleted',
        data: productDeleted,
      });
    } catch (err) {
      next(err);
    }
  }

  async mockingProducts(req, res) {
    const products = [];
    for (let i = 0; i < 100; i++) {
      products.push(generateProduct());
    }
    res.send({ status: 'success', msg: 'Test products list', data: products });
  }
}

export const productController = new ProductController();

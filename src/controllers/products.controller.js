import { CustomError } from '../utils/errors/custom-error.js';
import { EErrors } from '../utils/errors/dictionary-error.js';
import { productService } from '../services/products.service.js';
import { userService } from '../services/users.service.js';
import ProductDTO from './DTO/products.dto.js';
import { generateProduct } from '../utils/facker.js';
import { logger } from '../utils/logger.js';

class ProductController {
  async getAllProducts(_, res, next) {
    try {
      const product = await productService.getAllProducts();
      if (!product) {
        throw new CustomError(EErrors.PRODUCT_NOT_FOUND.code, EErrors.PRODUCT_NOT_FOUND.name, EErrors.PRODUCT_NOT_FOUND.cause, EErrors.PRODUCT_NOT_FOUND.message);
      }
      return res.status(200).json({
        status: 'success',
        msg: 'Products list',
        data: product,
      });
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  }

  async getProductById(req, res, next) {
    try {
      const { pid } = req.params;

      logger.debug(`Product id received by parameter: ${pid}`);

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
      logger.error(err.message);
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const { title, description, code, price, stock, category, thumbnail } = req.body;

      let owner;
      if (req.session?.user?.email) {
        owner = req.session.user.email;
      } else {
        owner = 'adminCoder@coder.com';
      }

      if (!title || !description || !code || !price || !stock || !category || !thumbnail) {
        throw new CustomError(EErrors.INVALID_INPUT_ERROR.code, EErrors.INVALID_INPUT_ERROR.name, EErrors.INVALID_INPUT_ERROR.cause, EErrors.INVALID_INPUT_ERROR.message);
      }

      let product = new ProductDTO({ title, description, code, price, stock, category, thumbnail, owner });
      const productCreated = await productService.create(product);

      return res.status(201).json({
        status: 'success',
        msg: 'Product created',
        data: productCreated,
      });
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  }

  async updateOne(req, res, next) {
    try {
      const { pid } = req.params;

      console.log(pid);

      const { title, description, code, price, stock, category, thumbnail } = req.body;
      let status;
      let owner;

      if (!title || !description || !code || !price || !stock || !category || !thumbnail) {
        throw new CustomError(EErrors.INVALID_INPUT_ERROR.code, EErrors.INVALID_INPUT_ERROR.name, EErrors.INVALID_INPUT_ERROR.cause, EErrors.INVALID_INPUT_ERROR.message);
      }

      if (stock > 0) {
        status = true;
      } else {
        status = false;
      }

      if (req.session?.user?.email) {
        owner = req.session.user.email;
      } else {
        owner = 'adminCoder@coder.com';
      }

      let product = new ProductDTO({ title, description, code, price, status, stock, category, thumbnail, owner });

      const productUpdated = await productService.updateOne(pid, product);

      return res.status(200).json({
        status: 'success',
        msg: 'Product updated',
        data: productUpdated,
      });
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  }

  async deleteOne(req, res, next) {
    try {
      const { pid } = req.params;

      const productFound = await productService.getProductById(pid);
      const owner = productFound.owner;

      const user = await userService.getUserByEmail(owner);

      if (productFound.owner === 'adminCoder@coder.com' || (user.rol === 'premium' && productFound.owner === user.email)) {
        const productDeleted = await productService.deleteOne(pid);

        return res.status(200).json({
          status: 'success',
          msg: 'Product deleted',
          data: productDeleted,
        });
      } else {
        throw new CustomError(EErrors.PRODUCT_OWNER_DELETE.code, EErrors.PRODUCT_OWNER_DELETE.name, EErrors.PRODUCT_OWNER_DELETE.cause, EErrors.PRODUCT_OWNER_DELETE.message);
      }
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  }

  async mockingProducts(_, res) {
    const products = [];
    for (let i = 0; i < 100; i++) {
      products.push(generateProduct());
    }
    res.send({ status: 'success', msg: 'Test products list', data: products });
  }
}

export const productController = new ProductController();

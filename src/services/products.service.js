import { ProductModel } from '../DAO/factory.js';
import { CustomError } from '../utils/errors/custom-error.js';
import { EErrors } from '../utils/errors/dictionary-error.js';
import { logger } from '../utils/logger.js';

const productModel = new ProductModel();

class ProductService {
  async getAllProducts() {
    try {
      const product = await productModel.getAllProducts();
      if (!product) {
        throw new CustomError(EErrors.PRODUCT_NOT_FOUND.code, EErrors.PRODUCT_NOT_FOUND.name, EErrors.PRODUCT_NOT_FOUND.cause, EErrors.PRODUCT_NOT_FOUND.message);
      }
      return product;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }

  async getProductById(productId) {
    try {
      const product = await productModel.getProductById(productId);

      logger.debug(`Product found in BD: ${product}`);

      if (!product) {
        throw new CustomError(EErrors.PRODUCT_NOT_FOUND.code, EErrors.PRODUCT_NOT_FOUND.name, EErrors.PRODUCT_NOT_FOUND.cause, EErrors.PRODUCT_NOT_FOUND.message);
      }
      return product;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }

  async create(product) {
    try {
      const productCreated = await productModel.create(product);
      if (!productCreated) {
        throw new CustomError(EErrors.PRODUCT_NOT_FOUND.code, EErrors.PRODUCT_NOT_FOUND.name, EErrors.PRODUCT_NOT_FOUND.cause, EErrors.PRODUCT_NOT_FOUND.message);
      }
      return productCreated;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }

  async updateOne(id, product) {
    try {
      const productUpdated = await productModel.updateOne(id, product);
      if (!productUpdated) {
        throw new CustomError(EErrors.PRODUCT_NOT_FOUND.code, EErrors.PRODUCT_NOT_FOUND.name, EErrors.PRODUCT_NOT_FOUND.cause, EErrors.PRODUCT_NOT_FOUND.message);
      }
      return productUpdated;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }

  async deleteOne(id) {
    try {
      const productDeleted = await productModel.deleteOne(id);
      logger.debug(`Product found in BD: ${productDeleted}`);
      if (!productDeleted) {
        throw new CustomError(EErrors.PRODUCT_NOT_FOUND.code, EErrors.PRODUCT_NOT_FOUND.name, EErrors.PRODUCT_NOT_FOUND.cause, EErrors.PRODUCT_NOT_FOUND.message);
      }
      return productDeleted;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }
}

export const productService = new ProductService();

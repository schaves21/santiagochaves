import { ProductModel } from '../DAO/factory.js';
import { logger } from '../utils/logger.js';

const productModel = new ProductModel();

class ProductService {
  async getAllProducts() {
    try {
      const product = await productModel.getAllProducts();
      return product;
    } catch (err) {
      logger.error(err);
    }
  }

  async getProductById(productId) {
    try {
      const product = await productModel.getProductById(productId);
      return product;
    } catch (err) {
      logger.error(err);
    }
  }

  async getProductByCode(code) {
    try {
      const codeFound = await productModel.getProductByCode(code);
      return codeFound;
    } catch (err) {
      logger.error(err);
    }
  }

  async create(product) {
    try {
      const productCreated = await productModel.create(product);
      return productCreated;
    } catch (err) {
      logger.error(err);
    }
  }

  async updateOne(id, product) {
    try {
      const productUpdated = await productModel.updateOne(id, product);
      return productUpdated;
    } catch (err) {
      logger.error(err);
    }
  }

  async deleteOne(id) {
    try {
      const productDeleted = await productModel.deleteOne(id);
      logger.debug(`Product found in BD: ${productDeleted}`);
      return productDeleted;
    } catch (err) {
      logger.error(err);
    }
  }

  async deleteProductView(pid) {
    try {
      const productDeleted = await productModel.deleteProductView(pid);
      return productDeleted;
    } catch (err) {
      logger.error(err);
    }
  }
}

export const productService = new ProductService();

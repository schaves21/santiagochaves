import { productMongoose } from '../mongo/schemas/products.mongoose.js';
import { CustomError } from '../../utils/errors/custom-error.js';
import { EErrors } from '../../utils/errors/dictionary-error.js';
import { logger } from '../../utils/logger.js';
import mongoose from 'mongoose';

export default class ProductModel {
  constructor() {}
  async getAllProducts() {
    try {
      const product = await productMongoose.find({});
      return product;
    } catch (err) {
      logger.error(err);
    }
  }

  async getProductById(productId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return null;
      }
      const product = await productMongoose.findById({ _id: productId });
      return product;
    } catch (err) {
      logger.error(err);
    }
  }

  async getProductByCode(code) {
    try {
      const codeFound = await productMongoose.findOne({ code });
      return codeFound || null;
    } catch (err) {
      logger.error(err);
    }
  }

  async create(product) {
    try {
      const productCreated = await productMongoose.create(product);
      return productCreated;
    } catch (err) {
      logger.error(err);
    }
  }

  async updateOne(_id, product) {
    try {
      const productUptaded = await productMongoose.findByIdAndUpdate(_id, product, { new: true });
      return productUptaded;
    } catch (err) {
      logger.error(err);
    }
  }

  async deleteOne(_id) {
    try {
      const productDeleted = await productMongoose.deleteOne({ _id });
      if (productDeleted.deletedCount === 1) {
        return true;
      } else {
        throw new CustomError(EErrors.PRODUCT_NOT_FOUND.code, EErrors.PRODUCT_NOT_FOUND.name, EErrors.PRODUCT_NOT_FOUND.cause, EErrors.PRODUCT_NOT_FOUND.message);
      }
    } catch (err) {
      if (err instanceof CustomError) {
        logger.error(err);
      }
    }
  }

  async deleteProductView(pid) {
    try {
      const productDeleted = await productMongoose.findByIdAndRemove(pid);
      return productDeleted;
    } catch (err) {
      logger.error(err);
    }
  }
}

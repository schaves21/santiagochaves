import { productMongoose } from '../mongo/schemas/products.mongoose.js';
import { CustomError } from '../../utils/errors/custom-error.js';
import { EErrors } from '../../utils/errors/dictionary-error.js';

export default class ProductModel {
  constructor() {}
  async getAllProducts() {
    try {
      const product = await productMongoose.find({});
      if (!product) {
        throw new CustomError(EErrors.PRODUCT_NOT_FOUND.code, EErrors.PRODUCT_NOT_FOUND.name, EErrors.PRODUCT_NOT_FOUND.cause, EErrors.PRODUCT_NOT_FOUND.message);
      }
      return product;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
    }
  }

  async getProductById(productId) {
    try {
      const product = await productMongoose.findById({ _id: productId });

      if (!product) {
        throw new CustomError(EErrors.PRODUCT_NOT_FOUND.code, EErrors.PRODUCT_NOT_FOUND.name, EErrors.PRODUCT_NOT_FOUND.cause, EErrors.PRODUCT_NOT_FOUND.message);
      }
      return product;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
    }
  }

  async create(product) {
    try {
      const productCreated = await productMongoose.create(product);
      if (!productCreated) {
        throw new CustomError(EErrors.PRODUCT_NOT_FOUND.code, EErrors.PRODUCT_NOT_FOUND.name, EErrors.PRODUCT_NOT_FOUND.cause, EErrors.PRODUCT_NOT_FOUND.message);
      }
      return productCreated;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
    }
  }

  async updateOne(_id, product) {
    try {
      const productUptaded = await productMongoose.findByIdAndUpdate(_id, product, { new: true });
      if (!productUptaded) {
        throw new CustomError(EErrors.PRODUCT_NOT_FOUND.code, EErrors.PRODUCT_NOT_FOUND.name, EErrors.PRODUCT_NOT_FOUND.cause, EErrors.PRODUCT_NOT_FOUND.message);
      }
      return productUptaded;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
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
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
    }
  }
}

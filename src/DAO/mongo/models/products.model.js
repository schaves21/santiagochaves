import { productMongoose } from '../products.mongoose.js';

class ProductModel {
  async getAllProducts() {
    try {
      const product = await productMongoose.find({});
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (error) {
      throw error;
    }
  }

  async get() {
    try {
      const product = await productMongoose.find({});
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (error) {
      throw error;
    }
  }

  async readById(_id) {
    try {
      const productById = await productMongoose.findOne({ _id });
      return productById;
    } catch (error) {
      throw error;
    }
  }

  async readByIds(ids) {
    try {
      const products = await productMongoose.find({ _id: { $in: ids } });
      return products;
    } catch (error) {
      throw error;
    }
  }

  async getProductById(productId) {
    try {
      const product = await productMongoose.findById(productId);

      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (error) {
      throw error;
    }
  }

  async create(product) {
    try {
      const productCreated = await productMongoose.create(product);
      return productCreated;
    } catch (error) {
      throw error;
    }
  }

  async updateOne(_id, product) {
    try {
      const productUptaded = await productMongoose.findByIdAndUpdate(_id, product, { new: true });
      return productUptaded;
    } catch (error) {
      throw error;
    }
  }

  async deleteOne(_id) {
    try {
      const productDeleted = await productMongoose.deleteOne({ _id });
      if (productDeleted.deletedCount === 1) {
        return true;
      } else {
        throw new Error('Product not found');
      }
    } catch (error) {
      throw error;
    }
  }
}

export const productModel = new ProductModel();

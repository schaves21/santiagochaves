import { productMongoose } from './mongoose/products.mongoose.js';

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

  async create(newUser) {
    try {
      const productCreated = await productMongoose.create(newUser);
      return productCreated;
    } catch (error) {
      throw error;
    }
  }

  async updateOne(id, title, description, code, price, status, stock, category, thumbnail) {
    try {
      const productUptaded = await productMongoose.updateOne({ _id: id }, { title, description, code, price, status, stock, category, thumbnail });
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

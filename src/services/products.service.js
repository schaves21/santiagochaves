import getModel from '../DAO/factory.js';

const models = await getModel();
const productModel = models.products;

class ProductService {
  /*
  validate(title, description, code, price, status, stock, category, thumbnail) {
    if (!title || !description || !code || !price || !status || !stock || !category || !thumbnail) {
      console.log('Validation error: please complete all fields.');
      throw new Error('Validation error: please complete all fields.');
    }
  }
  */

  async getAllProducts() {
    try {
      const product = await productModel.getAllProducts();
      return product;
    } catch (error) {
      throw error;
    }
  }

  async getProductById(productId) {
    try {
      const product = await productModel.getProductById(productId);
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (error) {
      throw error;
    }
  }

  /*
  async create(title, description, code, price, status, stock, category, thumbnail) {
    try {
      this.validate(title, description, code, price, status, stock, category, thumbnail);

      const newProduct = {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail,
      };

      const productCreated = await productModel.create(newProduct);

      return productCreated;
    } catch (error) {
      throw error;
    }
  }
  */

  async create(product) {
    try {
      const productCreated = await productModel.create(product);
      return productCreated;
    } catch (error) {
      throw error;
    }
  }

  /*
  async updateOne(id, title, description, code, price, status, stock, category, thumbnail) {
    try {
      this.validate(title, description, code, price, status, stock, category, thumbnail);
      const productUptaded = await productModel.updateOne(id, title, description, code, price, status, stock, category, thumbnail);
      return productUptaded;
    } catch (error) {
      throw error;
    }
  }
  */

  async updateOne(id, product) {
    try {
      const productUpdated = await productModel.updateOne(id, product);
      return productUpdated;
    } catch (error) {
      throw error;
    }
  }

  async deleteOne(id) {
    try {
      const productDeleted = await productModel.deleteOne(id);
      return productDeleted;
    } catch (error) {
      throw error;
    }
  }
}

export const productService = new ProductService();

import { productModel } from "../dao/models/products.model.js";

class ProductService {
  async getAll() {
    const products = await productModel.find(
      {},
      {
        _id: true,
        title: true,
        description: true,
        code: true,
        price: true,
        status: true,
        stock: true,
        category: true,
        thumbnail: true,
      }
    );
    return products;
  }

  async create({
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail,
  }) {
    const productCreated = await productModel.create({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    });
    return productCreated;
  }

  async updateOne({
    _id,
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail,
  }) {
    const productUptaded = await productModel.updateOne(
      {
        _id: _id,
      },
      {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail,
      }
    );
    return productUptaded;
  }

  async deleteOne(_id) {
    const result = await productModel.deleteOne({ _id: _id });
    return result;
  }
}

export const productService = new ProductService();

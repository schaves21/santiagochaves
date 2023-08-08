import { productService } from '../services/products.service.js';
import ProductDTO from './DTO/products.dto.js';

class ProductController {
  async getAllProducts(req, res) {
    try {
      const product = await productService.getAllProducts();
      return res.status(200).json({
        status: 'success',
        msg: 'Products list',
        payload: product,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 'error',
        msg: 'Something went wrong',
        payload: {},
      });
    }
  }

  async getProductById(req, res) {
    try {
      const { pid } = req.params;
      const product = await productService.getProductById(pid);
      return res.status(200).json({
        status: 'success',
        msg: 'Product',
        data: product,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 'error',
        msg: 'Something went wrong :(',
        data: {},
      });
    }
  }

  async create(req, res) {
    try {
      const { title, description, code, price, status, stock, category, thumbnail } = req.body;

      let product = new ProductDTO({ title, description, code, price, status, stock, category, thumbnail });
      const productCreated = await productService.create(product);

      return res.status(201).json({
        status: 'success',
        msg: 'Product created',
        data: productCreated,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 'error',
        msg: 'Something went wrong :(',
        data: {},
      });
    }
  }

  async updateOne(req, res) {
    try {
      const { id } = req.params;
      const { title, description, code, price, status, stock, category, thumbnail } = req.body;

      let product = new ProductDTO({ title, description, code, price, status, stock, category, thumbnail });
      const productUpdated = await productService.updateOne(id, product);

      return res.status(200).json({
        status: 'success',
        msg: 'Product updated',
        data: productUpdated,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 'error',
        msg: 'Something went wrong :(',
        data: {},
      });
    }
  }

  async deleteOne(req, res) {
    try {
      const { id } = req.params;
      const productDeleted = await productService.deleteOne(id);
      return res.status(200).json({
        status: 'success',
        msg: 'Product deleted',
        data: productDeleted,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 'error',
        msg: 'Something went wrong :(',
        data: {},
      });
    }
  }
}

export const productController = new ProductController();

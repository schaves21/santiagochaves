import { CustomError } from '../utils/errors/custom-error.js';
import { EErrors } from '../utils/errors/dictionary-error.js';
import { productService } from '../services/products.service.js';
import { userService } from '../services/users.service.js';
import ProductDTO from './DTO/products.dto.js';
import { generateProduct } from '../utils/facker.js';
import { logger } from '../utils/logger.js';
import env from '../config/enviroment.config.js';
import { transport } from '../utils/nodemailer.js';

class ProductController {
  async getAllProducts(_, res) {
    try {
      const product = await productService.getAllProducts();

      return res.status(200).json({
        status: 'success',
        msg: 'Products list',
        payload: product,
      });
    } catch (err) {
      logger.error(err);
      throw new CustomError(EErrors.UNEXPECTED_ERROR.code, EErrors.UNEXPECTED_ERROR.name, EErrors.UNEXPECTED_ERROR.cause, EErrors.UNEXPECTED_ERROR.message);
    }
  }

  async getProductById(req, res) {
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
        payload: product,
      });
    } catch (err) {
      logger.error(err);
      throw new CustomError(EErrors.UNEXPECTED_ERROR.code, EErrors.UNEXPECTED_ERROR.name, EErrors.UNEXPECTED_ERROR.cause, EErrors.UNEXPECTED_ERROR.message);
    }
  }

  async create(req, res) {
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

      const codeFound = await productService.getProductByCode(code);

      if (codeFound) {
        throw new CustomError(EErrors.PRODUCT_CODE_EXIST.code, EErrors.PRODUCT_CODE_EXIST.name, EErrors.PRODUCT_CODE_EXIST.cause, EErrors.PRODUCT_CODE_EXIST.message);
      }

      let product = new ProductDTO({ title, description, code, price, stock, category, thumbnail, owner });
      const productCreated = await productService.create(product);

      return res.status(201).json({
        status: 'success',
        msg: 'Product created',
        payload: productCreated,
      });
    } catch (err) {
      logger.error(err);
      throw new CustomError(EErrors.UNEXPECTED_ERROR.code, EErrors.UNEXPECTED_ERROR.name, EErrors.UNEXPECTED_ERROR.cause, EErrors.UNEXPECTED_ERROR.message);
    }
  }

  async updateOne(req, res) {
    try {
      const { pid } = req.params;

      const { title, description, code, price, stock, category, thumbnail } = req.body;

      if (!title || !description || !code || !price || !stock || !category || !thumbnail) {
        throw new CustomError(EErrors.INVALID_INPUT_ERROR.code, EErrors.INVALID_INPUT_ERROR.name, EErrors.INVALID_INPUT_ERROR.cause, EErrors.INVALID_INPUT_ERROR.message);
      }

      let product = new ProductDTO({ title, description, code, price, stock, category, thumbnail });

      const productUpdated = await productService.updateOne(pid, product);

      return res.status(200).json({
        status: 'success',
        msg: 'Product updated',
        payload: productUpdated,
      });
    } catch (err) {
      logger.error(err);
      throw new CustomError(EErrors.UNEXPECTED_ERROR.code, EErrors.UNEXPECTED_ERROR.name, EErrors.UNEXPECTED_ERROR.cause, EErrors.UNEXPECTED_ERROR.message);
    }
  }

  async deleteOne(req, res) {
    try {
      const { pid } = req.params;
      const email = req.session?.user?.email;

      const productFound = await productService.getProductById(pid);
      const owner = productFound.owner;

      const user = await userService.getUserByEmail(owner);

      if (email === 'adminCoder@coder.com' || (user.rol === 'premium' && productFound.owner === user.email)) {
        const productDeleted = await productService.deleteOne(pid);

        const to = productFound.owner;
        const subject = 'Product deleted';
        const htmlContent = `
        <div>
          <h2>Dear ${user.firstName},</h2>
          <p>The product ${productFound.title} has been removed from your premium account</p>
        </div>
      `;

        await transport.sendMail({
          from: env.googleMail,
          to: to,
          subject: subject,
          html: htmlContent,
        });

        return res.status(200).json({
          status: 'success',
          msg: 'Product deleted',
          payload: productDeleted,
        });
      } else {
        throw new CustomError(EErrors.PRODUCT_OWNER_DELETE.code, EErrors.PRODUCT_OWNER_DELETE.name, EErrors.PRODUCT_OWNER_DELETE.cause, EErrors.PRODUCT_OWNER_DELETE.message);
      }
    } catch (err) {
      logger.error(err);
      throw new CustomError(EErrors.UNEXPECTED_ERROR.code, EErrors.UNEXPECTED_ERROR.name, EErrors.UNEXPECTED_ERROR.cause, EErrors.UNEXPECTED_ERROR.message);
    }
  }

  async mockingProducts(_, res) {
    try {
      const products = [];
      for (let i = 0; i < 100; i++) {
        products.push(generateProduct());
      }
      res.send({ status: 'success', msg: 'Test products list', payload: products });
    } catch (err) {
      logger.error(err);
      throw new CustomError(EErrors.UNEXPECTED_ERROR.code, EErrors.UNEXPECTED_ERROR.name, EErrors.UNEXPECTED_ERROR.cause, EErrors.UNEXPECTED_ERROR.message);
    }
  }
}

export const productController = new ProductController();

import { cartService } from '../services/carts.service.js';
import { productService } from '../services/products.service.js';
import { CustomError } from '../utils/errors/custom-error.js';
import { EErrors } from '../utils/errors/dictionary-error.js';
import { logger } from '../utils/logger.js';

class CartController {
  async getAllCarts(_, res, next) {
    try {
      const cart = await cartService.getAllCarts();
      if (!cart) {
        throw new CustomError(EErrors.CART_NOT_FOUND.code, EErrors.CART_NOT_FOUND.name, EErrors.CART_NOT_FOUND.cause, EErrors.CART_NOT_FOUND.message);
      }
      res.status(200).json(cart);
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  }

  async getCartById(req, res, next) {
    try {
      const cartId = req.params.cid;

      logger.debug(`Cart id received by parameter: ${cartId}`);

      const cart = await cartService.getCartById(cartId);

      if (!cart) {
        throw new CustomError(EErrors.CART_NOT_FOUND.code, EErrors.CART_NOT_FOUND.name, EErrors.CART_NOT_FOUND.cause, EErrors.CART_NOT_FOUND.message);
      }

      res.status(200).json(cart);
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  }

  async create(_, res, next) {
    try {
      const newCart = await cartService.create();
      if (!newCart) {
        throw new CustomError(EErrors.CART_NOT_FOUND.code, EErrors.CART_NOT_FOUND.name, EErrors.CART_NOT_FOUND.cause, EErrors.CART_NOT_FOUND.message);
      }
      res.status(201).json(newCart);
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  }

  async addProductCart(req, res, next) {
    try {
      const { cid, pid } = req.params;
      const userEmail = req.session.user.email;

      const product = await productService.getProductById(pid);

      if (product.owner === userEmail) {
        throw new CustomError(EErrors.PRODUCT_OWNER.code, EErrors.PRODUCT_OWNER.name, EErrors.PRODUCT_OWNER.cause, EErrors.PRODUCT_OWNER.message);
      }

      const cart = await cartService.addProductCart(cid, pid);

      if (!cart) {
        throw new CustomError(EErrors.CART_NOT_FOUND.code, EErrors.CART_NOT_FOUND.name, EErrors.CART_NOT_FOUND.cause, EErrors.CART_NOT_FOUND.message);
      }
      res.status(201).json(cart);
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  }

  async updateCart(req, res, next) {
    try {
      const { cid } = req.params;
      const { products } = req.body;
      const cart = await cartService.updateCart(cid, products);
      if (!cart) {
        throw new CustomError(EErrors.CART_NOT_FOUND.code, EErrors.CART_NOT_FOUND.name, EErrors.CART_NOT_FOUND.cause, EErrors.CART_NOT_FOUND.message);
      }
      res.status(200).json({
        status: 'success',
        message: 'Cart updated successfully',
        cart,
      });
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  }

  async updateProductQuantity(req, res, next) {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      const cart = await cartService.updateProductQuantity(cid, pid, quantity);
      if (!cart) {
        throw new CustomError(EErrors.CART_NOT_FOUND.code, EErrors.CART_NOT_FOUND.name, EErrors.CART_NOT_FOUND.cause, EErrors.CART_NOT_FOUND.message);
      }
      res.status(200).json({ status: 'success', message: 'Product quantity updated', cart });
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  }

  async removeProduct(req, res, next) {
    try {
      const { cid, pid } = req.params;
      const cart = await cartService.removeProduct(cid, pid);
      if (!cart) {
        throw new CustomError(EErrors.CART_NOT_FOUND.code, EErrors.CART_NOT_FOUND.name, EErrors.CART_NOT_FOUND.cause, EErrors.CART_NOT_FOUND.message);
      }
      res.status(200).json({
        status: 'success',
        message: 'Product removed from cart',
        cart,
      });
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  }

  async clearCart(req, res, next) {
    try {
      const { cid } = req.params;
      logger.debug(`Cart id received by parameter: ${cid}`);
      await cartService.clearCart(cid);
      res.status(200).json({ status: 'success', message: 'Cart cleared successfully' });
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  }
}

export const cartController = new CartController();

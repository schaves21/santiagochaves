import { cartService } from '../services/carts.service.js';
import { CustomError } from '../utils/errors/custom-error.js';
import { EErrors } from '../utils/errors/dictionary-error.js';

class CartController {
  async getAllCarts(req, res, next) {
    try {
      const cart = await cartService.getAllCarts();
      if (!cart) {
        throw new CustomError(EErrors.CART_NOT_FOUND.code, EErrors.CART_NOT_FOUND.name, EErrors.CART_NOT_FOUND.cause, EErrors.CART_NOT_FOUND.message);
      }
      res.status(200).json(cart);
    } catch (err) {
      next(err);
    }
  }

  async getCartById(req, res, next) {
    try {
      const cartId = req.params.cid;
      const cart = await cartService.getCartById(cartId);

      if (!cart) {
        throw new CustomError(EErrors.CART_NOT_FOUND.code, EErrors.CART_NOT_FOUND.name, EErrors.CART_NOT_FOUND.cause, EErrors.CART_NOT_FOUND.message);
      }

      res.status(200).json(cart);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const newCart = await cartService.create();
      if (!newCart) {
        throw new CustomError(EErrors.CART_NOT_FOUND.code, EErrors.CART_NOT_FOUND.name, EErrors.CART_NOT_FOUND.cause, EErrors.CART_NOT_FOUND.message);
      }
      res.status(201).json(newCart);
    } catch (err) {
      next(err);
    }
  }

  async addProductCart(req, res, next) {
    try {
      const { cid, pid } = req.params;
      const cart = await cartService.addProductCart(cid, pid);
      if (!cart) {
        throw new CustomError(EErrors.CART_NOT_FOUND.code, EErrors.CART_NOT_FOUND.name, EErrors.CART_NOT_FOUND.cause, EErrors.CART_NOT_FOUND.message);
      }
      res.status(200).json(cart);
    } catch (err) {
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
      next(err);
    }
  }

  async clearCart(req, res, next) {
    try {
      const { cid } = req.params;
      await cartService.clearCart(cid);
      res.status(200).json({ status: 'success', message: 'Cart cleared successfully' });
    } catch (err) {
      next(err);
    }
  }
}

export const cartController = new CartController();

import { cartService } from '../services/carts.service.js';
import { productService } from '../services/products.service.js';
import { userService } from '../services/users.service.js';
import { CustomError } from '../utils/errors/custom-error.js';
import { EErrors } from '../utils/errors/dictionary-error.js';
import { logger } from '../utils/logger.js';

class CartController {
  async getAllCarts(_, res) {
    try {
      const cart = await cartService.getAllCarts();
      return res.status(200).json({
        status: 'success',
        msg: 'Carts list',
        payload: cart,
      });
    } catch (err) {
      logger.error(err);
      throw new CustomError(EErrors.UNEXPECTED_ERROR.code, EErrors.UNEXPECTED_ERROR.name, EErrors.UNEXPECTED_ERROR.cause, EErrors.UNEXPECTED_ERROR.message);
    }
  }

  async getCartById(req, res) {
    try {
      const cartId = req.params.cid;

      logger.debug(`Cart id received by parameter: ${cartId}`);

      const cart = await cartService.getCartById(cartId);

      if (!cart) {
        throw new CustomError(EErrors.CART_NOT_FOUND.code, EErrors.CART_NOT_FOUND.name, EErrors.CART_NOT_FOUND.cause, EErrors.CART_NOT_FOUND.message);
      }

      return res.status(200).json({
        status: 'success',
        msg: 'Cart',
        payload: cart,
      });
    } catch (err) {
      logger.error(err);
      throw new CustomError(EErrors.UNEXPECTED_ERROR.code, EErrors.UNEXPECTED_ERROR.name, EErrors.UNEXPECTED_ERROR.cause, EErrors.UNEXPECTED_ERROR.message);
    }
  }

  async create(_, res) {
    try {
      const newCart = await cartService.create();
      return res.status(201).json({
        status: 'success',
        msg: 'Cart created',
        payload: newCart,
      });
    } catch (err) {
      logger.error(err);
      throw new CustomError(EErrors.UNEXPECTED_ERROR.code, EErrors.UNEXPECTED_ERROR.name, EErrors.UNEXPECTED_ERROR.cause, EErrors.UNEXPECTED_ERROR.message);
    }
  }

  async addProductCart(req, res) {
    try {
      const { cid, pid } = req.params;

      const cart = await cartService.getCartById(cid);

      if (!cart) {
        throw new CustomError(EErrors.CART_NOT_FOUND.code, EErrors.CART_NOT_FOUND.name, EErrors.CART_NOT_FOUND.cause, EErrors.CART_NOT_FOUND.message);
      }

      const product = await productService.getProductById(pid);

      const userFound = await userService.getUserByCartID(cid);

      if (product.owner === userFound.email) {
        throw new CustomError(EErrors.PRODUCT_OWNER.code, EErrors.PRODUCT_OWNER.name, EErrors.PRODUCT_OWNER.cause, EErrors.PRODUCT_OWNER.message);
      }

      const addProductcart = await cartService.addProductCart(cid, pid);

      if (!addProductcart) {
        throw new CustomError(EErrors.PRODUCT_IN_CART.code, EErrors.PRODUCT_IN_CART.name, EErrors.PRODUCT_IN_CART.cause, EErrors.PRODUCT_IN_CART.message);
      }

      return res.status(201).json({
        status: 'success',
        msg: 'Product add to cart',
        payload: addProductcart,
      });
    } catch (err) {
      logger.error(err);
      throw new CustomError(EErrors.UNEXPECTED_ERROR.code, EErrors.UNEXPECTED_ERROR.name, EErrors.UNEXPECTED_ERROR.cause, EErrors.UNEXPECTED_ERROR.message);
    }
  }

  async updateCart(req, res) {
    try {
      const { cid } = req.params;
      const { products } = req.body;

      const cart = await cartService.getCartById(cid);

      if (!cart) {
        throw new CustomError(EErrors.CART_NOT_FOUND.code, EErrors.CART_NOT_FOUND.name, EErrors.CART_NOT_FOUND.cause, EErrors.CART_NOT_FOUND.message);
      }

      const updateCart = await cartService.updateCart(cid, products);

      if (!updateCart) {
        throw new CustomError(EErrors.PRODUCT_CART_UPDATED.code, EErrors.PRODUCT_CART_UPDATED.name, EErrors.PRODUCT_CART_UPDATED.cause, EErrors.PRODUCT_CART_UPDATED.message);
      }

      res.status(200).json({
        status: 'success',
        msg: 'Cart updated successfully',
        payload: updateCart,
      });
    } catch (err) {
      logger.error(err);
      throw new CustomError(EErrors.UNEXPECTED_ERROR.code, EErrors.UNEXPECTED_ERROR.name, EErrors.UNEXPECTED_ERROR.cause, EErrors.UNEXPECTED_ERROR.message);
    }
  }

  async updateProductQuantity(req, res) {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      const cart = await cartService.updateProductQuantity(cid, pid, quantity);
      if (!cart) {
        throw new CustomError(EErrors.PRODUCT_QUANTITY_IN_CART.code, EErrors.PRODUCT_QUANTITY_IN_CART.name, EErrors.PRODUCT_QUANTITY_IN_CART.cause, EErrors.PRODUCT_QUANTITY_IN_CART.message);
      }
      res.status(200).json({ status: 'success', msg: 'Product quantity updated', payload: cart });
    } catch (err) {
      logger.error(err);
      throw new CustomError(EErrors.UNEXPECTED_ERROR.code, EErrors.UNEXPECTED_ERROR.name, EErrors.UNEXPECTED_ERROR.cause, EErrors.UNEXPECTED_ERROR.message);
    }
  }

  async removeProduct(req, res) {
    try {
      const { cid, pid } = req.params;
      const cart = await cartService.removeProduct(cid, pid);
      if (!cart) {
        throw new CustomError(EErrors.REMOVE_PRODUCT_CART.code, EErrors.REMOVE_PRODUCT_CART.name, EErrors.REMOVE_PRODUCT_CART.cause, EErrors.REMOVE_PRODUCT_CART.message);
      }
      res.status(200).json({
        status: 'success',
        msg: 'Product removed from cart',
        payload: cart,
      });
    } catch (err) {
      logger.error(err);
      throw new CustomError(EErrors.UNEXPECTED_ERROR.code, EErrors.UNEXPECTED_ERROR.name, EErrors.UNEXPECTED_ERROR.cause, EErrors.UNEXPECTED_ERROR.message);
    }
  }

  async clearCart(req, res) {
    try {
      const { cid } = req.params;
      logger.debug(`Cart id received by parameter: ${cid}`);
      const cart = await cartService.clearCart(cid);
      if (!cart) {
        throw new CustomError(EErrors.CLEAR_CART.code, EErrors.CLEAR_CART.name, EErrors.CLEAR_CART.cause, EErrors.CLEAR_CART.message);
      }
      res.status(200).json({ status: 'success', msg: 'Cart cleared successfully', payload: cart });
    } catch (err) {
      logger.error(err);
      throw new CustomError(EErrors.UNEXPECTED_ERROR.code, EErrors.UNEXPECTED_ERROR.name, EErrors.UNEXPECTED_ERROR.cause, EErrors.UNEXPECTED_ERROR.message);
    }
  }
}

export const cartController = new CartController();

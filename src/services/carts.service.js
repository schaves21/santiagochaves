import { CartModel } from '../DAO/factory.js';
import { CustomError } from '../utils/errors/custom-error.js';
import { EErrors } from '../utils/errors/dictionary-error.js';
import { logger } from '../utils/logger.js';

const cartModel = new CartModel();

class CartService {
  async getAllCarts() {
    try {
      const cart = await cartModel.getAllCarts({});
      if (!cart) {
        throw new CustomError(EErrors.CART_NOT_FOUND.code, EErrors.CART_NOT_FOUND.name, EErrors.CART_NOT_FOUND.cause, EErrors.CART_NOT_FOUND.message);
      }
      return cart;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await cartModel.getCartById(cartId);
      logger.debug(`Cart Id found in BD: ${cartId}`);
      if (!cart) {
        throw new CustomError(EErrors.CART_NOT_FOUND.code, EErrors.CART_NOT_FOUND.name, EErrors.CART_NOT_FOUND.cause, EErrors.CART_NOT_FOUND.message);
      }
      return cart;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }

  async create() {
    try {
      const cartCreated = await cartModel.create();
      if (!cartCreated) {
        throw new CustomError(EErrors.CART_NOT_FOUND.code, EErrors.CART_NOT_FOUND.name, EErrors.CART_NOT_FOUND.cause, EErrors.CART_NOT_FOUND.message);
      }
      return cartCreated;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }

  async addProductCart(cartId, productId) {
    try {
      const addProductCart = await cartModel.addProductCart(cartId, productId);
      if (!addProductCart) {
        throw new CustomError(EErrors.CART_NOT_FOUND.code, EErrors.CART_NOT_FOUND.name, EErrors.CART_NOT_FOUND.cause, EErrors.CART_NOT_FOUND.message);
      }
      return addProductCart;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }

  async updateCart(cartId, products) {
    try {
      const cart = await cartModel.updateCart(cartId, products);
      if (!cart) {
        throw new CustomError(EErrors.CART_NOT_FOUND.code, EErrors.CART_NOT_FOUND.name, EErrors.CART_NOT_FOUND.cause, EErrors.CART_NOT_FOUND.message);
      }
      return cart;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await cartModel.updateProductQuantity(cartId, productId, quantity);
      if (!cart) {
        throw new CustomError(EErrors.CART_NOT_FOUND.code, EErrors.CART_NOT_FOUND.name, EErrors.CART_NOT_FOUND.cause, EErrors.CART_NOT_FOUND.message);
      }
      return cart;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }

  async removeProduct(cartId, productId) {
    try {
      const cart = await cartModel.removeProduct(cartId, productId);
      if (!cart) {
        throw new CustomError(EErrors.CART_NOT_FOUND.code, EErrors.CART_NOT_FOUND.name, EErrors.CART_NOT_FOUND.cause, EErrors.CART_NOT_FOUND.message);
      }
      return cart;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await cartModel.clearCart(cartId);
      logger.debug(`Cart Id found in BD: ${cartId}`);
      if (!cart) {
        throw new CustomError(EErrors.CART_NOT_FOUND.code, EErrors.CART_NOT_FOUND.name, EErrors.CART_NOT_FOUND.cause, EErrors.CART_NOT_FOUND.message);
      }
      return cart;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }
}

export const cartService = new CartService();

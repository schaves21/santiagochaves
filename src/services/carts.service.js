import getModel from '../DAO/factory.js';
import { CustomError } from '../utils/errors/custom-error.js';
import { EErrors } from '../utils/errors/dictionary-error.js';

const models = await getModel();
const cartModel = models.carts;

class CartService {
  async getAllCarts() {
    try {
      const cart = await cartModel.getAllCarts({});
      if (!cart) {
        throw new CustomError(EErrors.CART_NOT_FOUND.code, EErrors.CART_NOT_FOUND.name, EErrors.CART_NOT_FOUND.cause, EErrors.CART_NOT_FOUND.message);
      }
      return cart;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await cartModel.getCartById(cartId);
      if (!cart) {
        throw new CustomError(EErrors.CART_NOT_FOUND.code, EErrors.CART_NOT_FOUND.name, EErrors.CART_NOT_FOUND.cause, EErrors.CART_NOT_FOUND.message);
      }
      return cart;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
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
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
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
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
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
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
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
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
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
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await cartModel.clearCart(cartId);
      if (!cart) {
        throw new CustomError(EErrors.CART_NOT_FOUND.code, EErrors.CART_NOT_FOUND.name, EErrors.CART_NOT_FOUND.cause, EErrors.CART_NOT_FOUND.message);
      }
      return cart;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
    }
  }
}

export const cartService = new CartService();

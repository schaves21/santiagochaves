import { CartModel } from '../DAO/factory.js';
import { logger } from '../utils/logger.js';

const cartModel = new CartModel();

class CartService {
  async getAllCarts() {
    try {
      const cart = await cartModel.getAllCarts({});
      return cart;
    } catch (err) {
      logger.error(err);
    }
  }

  async getCartById(cid) {
    try {
      const cart = await cartModel.getCartById(cid);
      logger.debug(`Cart Id found in BD: ${cid}`);
      return cart;
    } catch (err) {
      logger.error(err);
    }
  }

  async create() {
    try {
      const cartCreated = await cartModel.create();
      return cartCreated;
    } catch (err) {
      logger.error(err);
    }
  }

  async addProductCart(cid, pid) {
    try {
      const addProductCart = await cartModel.addProductCart(cid, pid);
      return addProductCart;
    } catch (err) {
      logger.error(err);
    }
  }

  async updateCart(cartId, products) {
    try {
      const cart = await cartModel.updateCart(cartId, products);
      return cart;
    } catch (err) {
      logger.error(err);
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await cartModel.updateProductQuantity(cartId, productId, quantity);
      return cart;
    } catch (err) {
      logger.error(err);
    }
  }

  async removeProduct(cartId, productId) {
    try {
      const cart = await cartModel.removeProduct(cartId, productId);
      return cart;
    } catch (err) {
      logger.error(err);
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await cartModel.clearCart(cartId);
      logger.debug(`Cart Id found in BD: ${cartId}`);
      return cart;
    } catch (err) {
      logger.error(err);
    }
  }
}

export const cartService = new CartService();

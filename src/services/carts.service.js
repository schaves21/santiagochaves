import getModel from '../DAO/factory.js';

const models = await getModel();
const cartModel = models.carts;

class CartService {
  async getAll() {
    try {
      const cart = await cartModel.getAll({});
      if (!cart) {
        throw new Error('Cart not found');
      }
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async readById(_id) {
    try {
      const productById = await cartModel.readById(_id);
      return productById;
    } catch (error) {
      throw error;
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await cartModel.getCartById(cartId);
      if (!cart) {
        throw new Error('Cart not found');
      }
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async create() {
    try {
      const cartCreated = await cartModel.create();
      return cartCreated;
    } catch (error) {
      throw error;
    }
  }

  async addProductCart(cartId, productId) {
    try {
      const addProductCart = await cartModel.addProductCart(cartId, productId);
      return addProductCart;
    } catch (error) {
      throw error;
    }
  }

  async updateCart(cartId, products) {
    try {
      const cart = await cartModel.updateCart(cartId, products);
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await cartModel.updateProductQuantity(cartId, productId, quantity);
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async removeProduct(cartId, productId) {
    try {
      const cart = await cartModel.removeProduct(cartId, productId);
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await cartModel.clearCart(cartId);
      return cart;
    } catch (error) {
      throw error;
    }
  }
}

export const cartService = new CartService();

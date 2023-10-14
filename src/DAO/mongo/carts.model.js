import { cartMongoose } from '../mongo/schemas/carts.mongoose.js';
import { productMongoose } from '../mongo/schemas/products.mongoose.js';
import { CustomError } from '../../utils/errors/custom-error.js';
import { EErrors } from '../../utils/errors/dictionary-error.js';
import { logger } from '../../utils/logger.js';
import mongoose from 'mongoose';

export default class CartModel {
  constructor() {}
  async getAllCarts() {
    try {
      const cart = await cartMongoose.find({});
      return cart;
    } catch (err) {
      logger.error(err);
    }
  }

  async viewCartById(cid) {
    try {
      const cart = await cartMongoose.findById(cid);
      return cart;
    } catch (err) {
      logger.error(err);
    }
  }

  async getCartById(cid) {
    try {
      if (!mongoose.Types.ObjectId.isValid(cid)) {
        return null;
      }
      const cart = await cartMongoose.findById(cid).populate('products.product').lean().exec();
      return cart;
    } catch (err) {
      logger.error(err);
    }
  }

  async create() {
    try {
      const cartCreated = await cartMongoose.create({});
      return cartCreated;
    } catch (err) {
      logger.error(err);
    }
  }

  async addProductCart(cid, pid) {
    try {
      const cart = await cartMongoose.findById(cid);
      const product = await productMongoose.findById(pid);

      cart.products.push({ product: product._id, quantity: 1 });
      await cart.save();
      return cart;
    } catch (err) {
      logger.error(err);
    }
  }

  async updateCart(cartId, updatedProduct) {
    try {
      const cart = await cartMongoose.findByIdAndUpdate(cartId, { products: updatedProduct.products }, { new: true });
      return cart;
    } catch (err) {
      logger.error(err);
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await cartMongoose.findById(cartId);
      if (!cart) {
        throw new CustomError(EErrors.CART_NOT_FOUND.code, EErrors.CART_NOT_FOUND.name, EErrors.CART_NOT_FOUND.cause, EErrors.CART_NOT_FOUND.message);
      }
      const productIndex = cart.products.findIndex((p) => p.product.toString() === productId);
      if (productIndex === -1) {
        throw new CustomError(EErrors.PRODUCT_NOT_FOUND.code, EErrors.PRODUCT_NOT_FOUND.name, EErrors.PRODUCT_NOT_FOUND.cause, EErrors.PRODUCT_NOT_FOUND.message);
      }
      cart.products[productIndex].quantity = quantity;
      await cart.save();
      return cart;
    } catch (err) {
      if (err instanceof CustomError) {
        logger.error(err);
      }
    }
  }

  async removeProduct(cartId, productId) {
    try {
      const cart = await cartMongoose.findById(cartId);
      if (!cart) {
        throw new CustomError(EErrors.CART_NOT_FOUND.code, EErrors.CART_NOT_FOUND.name, EErrors.CART_NOT_FOUND.cause, EErrors.CART_NOT_FOUND.message);
      }
      const productIndex = cart.products.findIndex((p) => p.product.toString() === productId);
      if (productIndex === -1) {
        throw new CustomError(EErrors.PRODUCT_NOT_FOUND.code, EErrors.PRODUCT_NOT_FOUND.name, EErrors.PRODUCT_NOT_FOUND.cause, EErrors.PRODUCT_NOT_FOUND.message);
      }
      cart.products.splice(productIndex, 1);
      await cart.save();
      return cart;
    } catch (err) {
      if (err instanceof CustomError) {
        logger.error(err);
      }
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await cartMongoose.findById(cartId);

      cart.products = [];
      await cart.save();
      return cart;
    } catch (err) {
      logger.error(err);
    }
  }
}

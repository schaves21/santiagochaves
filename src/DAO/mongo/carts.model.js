import { cartMongoose } from '../mongo/schemas/carts.mongoose.js';
import { productMongoose } from '../mongo/schemas/products.mongoose.js';
import { CustomError } from '../../utils/errors/custom-error.js';
import { EErrors } from '../../utils/errors/dictionary-error.js';

export default class CartModel {
  constructor() {}
  async getAllCarts() {
    try {
      const cart = await cartMongoose.find({});
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

  async viewCartById(cid) {
    try {
      const cart = await cartMongoose.findById(cid);
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
      const cart = await cartMongoose.findById(cartId).populate('products.product').lean().exec();
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
      const cartCreated = await cartMongoose.create({});
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
      const cart = await cartMongoose.findById(cartId);
      if (!cart) {
        throw new CustomError(EErrors.CART_NOT_FOUND.code, EErrors.CART_NOT_FOUND.name, EErrors.CART_NOT_FOUND.cause, EErrors.CART_NOT_FOUND.message);
      }
      const product = await productMongoose.findById(productId);

      if (!product) {
        throw new CustomError(EErrors.PRODUCT_NOT_FOUND.code, EErrors.PRODUCT_NOT_FOUND.name, EErrors.PRODUCT_NOT_FOUND.cause, EErrors.PRODUCT_NOT_FOUND.message);
      }

      cart.products.push({ product: product._id, quantity: 1 });
      await cart.save();
      return cart;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }

  async updateCart(cartId, products) {
    try {
      const cart = await cartMongoose.findByIdAndUpdate(cartId, { products }, { new: true });
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
        throw err;
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
        throw err;
      }
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await cartMongoose.findById(cartId);
      if (!cart) {
        throw new CustomError(EErrors.CART_NOT_FOUND.code, EErrors.CART_NOT_FOUND.name, EErrors.CART_NOT_FOUND.cause, EErrors.CART_NOT_FOUND.message);
      }
      cart.products = [];
      await cart.save();
      return cart;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }
}

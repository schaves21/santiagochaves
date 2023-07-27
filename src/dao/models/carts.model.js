import { cartMongoose } from './mongoose/carts.mongoose.js';
import { productMongoose } from './mongoose/products.mongoose.js';

class CartModel {
  async getAll() {
    try {
      const cart = await cartMongoose.find({});
      if (!cart) {
        throw new Error('Cart not found');
      }
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async viewCartById(cid) {
    try {
      const cart = await cartMongoose.findById(cid);
      if (!cart) {
        throw new Error('Cart not found');
      }
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await cartMongoose.findById(cartId).populate('products.product').lean().exec();
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
      const cartCreated = await cartMongoose.create({});
      return cartCreated;
    } catch (error) {
      throw error;
    }
  }

  async addProductCart(cartId, productId) {
    try {
      const cart = await cartMongoose.findById(cartId);
      const product = await productMongoose.findById(productId);
      if (!cart) {
        throw new Error('Cart not found');
      }
      if (!product) {
        throw new Error('Product not found');
      }

      cart.products.push({ product: product._id, quantity: 1 });
      await cart.save();
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async updateCart(cartId, products) {
    try {
      const cart = await cartMongoose.findByIdAndUpdate(cartId, { products }, { new: true });
      return cart;
    } catch (error) {
      throw new Error('Error updating cart in database');
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await cartMongoose.findById(cartId);
      const productIndex = cart.products.findIndex((p) => p.product.toString() === productId);
      if (productIndex === -1) {
        throw new Error('Product not found in cart');
      }
      cart.products[productIndex].quantity = quantity;
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error('Error updating product quantity in cart');
    }
  }

  async removeProduct(cartId, productId) {
    try {
      const cart = await cartMongoose.findById(cartId);
      const productIndex = cart.products.findIndex((p) => p.product.toString() === productId);
      if (productIndex === -1) {
        throw new Error('Product not found in cart');
      }
      cart.products.splice(productIndex, 1);
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error('Error removing product from cart');
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await cartMongoose.findById(cartId);
      cart.products = [];
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error('Error clearing cart');
    }
  }
}

export const cartModel = new CartModel();

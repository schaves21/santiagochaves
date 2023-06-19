import { cartModel } from "../dao/models/carts.model.js";
import { productModel } from "../dao/models/products.model.js";

class CartService {
  async getAll() {
    const cart = await cartModel.find({});
    if (!cart) {
      throw new Error("Cart not found");
    }
    return cart;
  }

  async getCartById(cartId) {
    const cart = await cartModel
      .findById(cartId)
      .populate("products.product")
      .lean()
      .exec();
    if (!cart) {
      throw new Error("Cart not found");
    }
    return cart;
  }

  async createOne() {
    const cartCreated = await cartModel.create({});
    return cartCreated;
  }

  async addProductCart(cartId, productId) {
    try {
      const cart = await cartModel.findById(cartId);
      const product = await productModel.findById(productId);
      if (!cart) {
        throw new Error("Cart not found");
      }
      if (!product) {
        throw new Error("Product not found");
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
      const cart = await cartModel.findByIdAndUpdate(
        cartId,
        { products },
        { new: true }
      );
      return cart;
    } catch (error) {
      throw new Error("Error updating cart in database");
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await cartModel.findById(cartId);
      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );
      if (productIndex === -1) {
        throw new Error("Product not found in cart");
      }
      cart.products[productIndex].quantity = quantity;
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error("Error updating product quantity in cart");
    }
  }

  async removeProduct(cartId, productId) {
    try {
      const cart = await cartModel.findById(cartId);
      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );
      if (productIndex === -1) {
        throw new Error("Product not found in cart");
      }
      cart.products.splice(productIndex, 1);
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error("Error removing product from cart");
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await cartModel.findById(cartId);
      cart.products = [];
      await cart.save();
    } catch (error) {
      throw new Error("Error clearing cart");
    }
  }
}

export const cartService = new CartService();

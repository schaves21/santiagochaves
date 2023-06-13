import { cartModel } from "../dao/models/carts.model.js";

class CartService {
  async getAll() {
    const carts = await cartModel.find({});
    if (!carts) {
      throw new Error("Carts not found");
    }
    return carts;
  }

  async addProductCart() {
    const cartCreated = await cartModel.create({
      products: [],
      quantity: 1,
    });
    return cartCreated;
  }
}

export const cartService = new CartService();

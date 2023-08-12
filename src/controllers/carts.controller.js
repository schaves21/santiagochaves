import { cartService } from '../services/carts.service.js';

class CartController {
  async getAll(req, res) {
    try {
      const cart = await cartService.getAll();
      res.status(200).json(cart);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async getCartById(req, res) {
    try {
      const cartId = req.params.cid;
      const cart = await cartService.getCartById(cartId);
      res.status(200).json(cart);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async create(req, res) {
    try {
      const newCart = await cartService.create();
      res.status(201).json(newCart);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async addProductCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const cart = await cartService.addProductCart(cid, pid);
      res.status(200).json(cart);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async updateCart(req, res) {
    try {
      const { cid } = req.params;
      const { products } = req.body;
      const cart = await cartService.updateCart(cid, products);
      res.status(200).json({
        status: 'success',
        message: 'Cart updated successfully',
        cart,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  }

  async updateProductQuantity(req, res) {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      const cart = await cartService.updateProductQuantity(cid, pid, quantity);
      res.status(200).json({ status: 'success', message: 'Product quantity updated', cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  }

  async removeProduct(req, res) {
    try {
      const { cid, pid } = req.params;
      const cart = await cartService.removeProduct(cid, pid);
      res.status(200).json({
        status: 'success',
        message: 'Product removed from cart',
        cart,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  }

  async clearCart(req, res) {
    try {
      const { cid } = req.params;
      await cartService.clearCart(cid);
      res.status(200).json({ status: 'success', message: 'Cart cleared successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  }
}

export const cartController = new CartController();

import { TicketModel, ProductModel } from '../DAO/factory.js';
import { cartService } from './carts.service.js';
import { logger } from '../utils/logger.js';

const ticketModel = new TicketModel();
const productModel = new ProductModel();

class TicketService {
  async getAllTickets() {
    try {
      const ticket = await ticketModel.getAllTickets();
      return ticket;
    } catch (err) {
      logger.error(err);
    }
  }

  async getTicketById(ticketId) {
    try {
      const ticket = await ticketModel.getTicketById(ticketId);
      logger.debug(`Ticket found in BD: ${ticket}`);
      return ticket;
    } catch (err) {
      logger.error(err);
    }
  }

  async VerifyStockPurchase(cart) {
    try {
      const productsProcessed = [];
      const productsNotProcessed = [];

      for (const cartProduct of cart.products) {
        const product = await productModel.getProductById(cartProduct.product._id);

        if (product.stock >= cartProduct.quantity) {
          product.stock -= cartProduct.quantity;
          productsProcessed.push({ productId: cartProduct.product._id, quantity: cartProduct.quantity, status: product.status });
        } else {
          product.status = false;
          productsNotProcessed.push({ productId: cartProduct.product._id, quantity: cartProduct.quantity, status: product.status });
        }
        await product.save();
      }
      const productsPurchase = [...productsProcessed, ...productsNotProcessed];
      return productsPurchase;
    } catch (err) {
      logger.error(err);
    }
  }

  async calculateTotalAmount(cart) {
    try {
      let amount = 0;

      for (const cartProduct of cart.products) {
        const productResult = await productModel.getProductById(cartProduct.product._id);
        if (productResult.stock === 0) {
          amount = amount - productResult.price;
        }
        amount += productResult.price * cartProduct.quantity;
      }
      return amount;
    } catch (err) {
      logger.error(err);
    }
  }

  async createTicket(code, amount, purchaser, productsTicket) {
    try {
      const ticket = {
        code: code,
        purchase_datetime: Date.now(),
        amount: amount,
        purchaser: purchaser,
        products: productsTicket,
      };

      const newTicket = await ticketModel.createTicket(ticket);

      return newTicket;
    } catch (err) {
      logger.error(err);
    }
  }

  async removeProcessedProducts(cid) {
    try {
      const cart = await cartService.getCartById(cid);
      cart.products = cart.products.filter((cartProduct) => cartProduct.product.status === true);
      for (const cartProduct of cart.products) {
        const pid = cartProduct.product._id.toString();
        const removeProductToCart = await cartService.removeProduct(cid, pid);
      }
    } catch (err) {
      logger.error(err);
    }
  }
}

export const ticketService = new TicketService();

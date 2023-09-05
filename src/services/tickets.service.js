import { TicketModel, ProductModel } from '../DAO/factory.js';
import { cartService } from './carts.service.js';
import { CustomError } from '../utils/errors/custom-error.js';
import { EErrors } from '../utils/errors/dictionary-error.js';
import { logger } from '../utils/logger.js';

const ticketModel = new TicketModel();
const productModel = new ProductModel();

class TicketService {
  async getAllTickets() {
    try {
      const ticket = await ticketModel.getAll({});
      if (!ticket) {
        throw new CustomError(EErrors.TICKET_NOT_FOUND.code, EErrors.TICKET_NOT_FOUND.name, EErrors.TICKET_NOT_FOUND.cause, EErrors.TICKET_NOT_FOUND.message);
      }
      return ticket;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }

  async getTicketById(ticketId) {
    try {
      const ticket = await ticketModel.getTicketById(ticketId);

      logger.debug(`Ticket found in BD: ${ticket}`);

      if (!ticket) {
        throw new CustomError(EErrors.TICKET_NOT_FOUND.code, EErrors.TICKET_NOT_FOUND.name, EErrors.TICKET_NOT_FOUND.cause, EErrors.TICKET_NOT_FOUND.message);
      }
      return ticket;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
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
      throw err;
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
      throw err;
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

      if (!newTicket) {
        throw new CustomError(EErrors.TICKET_NOT_FOUND.code, EErrors.TICKET_NOT_FOUND.name, EErrors.TICKET_NOT_FOUND.cause, EErrors.TICKET_NOT_FOUND.message);
      }

      return newTicket;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
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
      throw err;
    }
  }
}

export const ticketService = new TicketService();

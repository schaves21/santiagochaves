import { ticketService } from '../services/tickets.service.js';
import { cartService } from '../services/carts.service.js';
import { authService } from '../services/auth.service.js';
import { CustomError } from '../utils/errors/custom-error.js';
import { EErrors } from '../utils/errors/dictionary-error.js';
import { logger } from '../utils/logger.js';
import { nanoid } from 'nanoid';

class TicketController {
  async getAllTickets(_, res, next) {
    try {
      const ticket = await ticketService.getAllTickets();
      if (!ticket) {
        throw new CustomError(EErrors.TICKET_NOT_FOUND.code, EErrors.TICKET_NOT_FOUND.name, EErrors.TICKET_NOT_FOUND.cause, EErrors.TICKET_NOT_FOUND.message);
      }
      res.status(200).json(ticket);
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  }

  async getTicketById(req, res, next) {
    try {
      const ticketId = req.params.tid;
      logger.debug(`Ticket id received by parameter: ${ticketId}`);
      const ticket = await ticketService.getTicketById(ticketId);
      if (!ticket) {
        throw new CustomError(EErrors.TICKET_NOT_FOUND.code, EErrors.TICKET_NOT_FOUND.name, EErrors.TICKET_NOT_FOUND.cause, EErrors.TICKET_NOT_FOUND.message);
      }
      res.status(200).json(ticket);
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  }

  async createTicket(req, res) {
    try {
      const { cid } = req.params;

      logger.debug(`Getting Cart with Id: ${cid}`);

      const cart = await cartService.getCartById(cid);

      if (!cart) {
        throw new CustomError(EErrors.CART_NOT_FOUND.code, EErrors.CART_NOT_FOUND.name, EErrors.CART_NOT_FOUND.cause, EErrors.CART_NOT_FOUND.message);
      }

      const user = await authService.getUserById(cid);

      if (!user) {
        throw new CustomError(EErrors.USER_NOT_FOUND.code, EErrors.USER_NOT_FOUND.name, EErrors.USER_NOT_FOUND.cause, EErrors.USER_NOT_FOUND.message);
      }

      const purchaserEmail = user.email;

      const productsPurchase = await ticketService.VerifyStockPurchase(cart);

      const productsTicket = productsPurchase.filter((product) => product.status === true);
      const productsNotProcessed = productsPurchase.filter((product) => product.status === false);

      const amount = await ticketService.calculateTotalAmount(cart);

      const code = nanoid();

      const ticket = await ticketService.createTicket(code, amount, purchaserEmail, productsTicket);

      if (!ticket) {
        throw new CustomError(EErrors.TICKET_NOT_FOUND.code, EErrors.TICKET_NOT_FOUND.name, EErrors.TICKET_NOT_FOUND.cause, EErrors.TICKET_NOT_FOUND.message);
      }

      await ticketService.removeProcessedProducts(cid);

      return res.status(200).json({
        status: 'success',
        msg: 'Thanks for your purchase',
        ticket: ticket._id,
        productProcessed: productsTicket,
        productsNotProcessed: productsNotProcessed,
      });
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  }
}

export const ticketController = new TicketController();

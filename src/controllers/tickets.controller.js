import { ticketService } from '../services/tickets.service.js';
import { cartService } from '../services/carts.service.js';
import { authService } from '../services/auth.service.js';
import { nanoid } from 'nanoid';

class TicketController {
  async getAll(req, res) {
    try {
      const ticket = await ticketService.getAll();
      res.status(200).json(ticket);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async getTicketById(req, res) {
    try {
      const ticketId = req.params.tid;
      const ticket = await ticketService.getTicketById(ticketId);
      res.status(200).json(ticket);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async createTicket(req, res) {
    try {
      const { cid } = req.params;
      const cart = await cartService.getCartById(cid);

      const user = await authService.getUserById(cid);

      const purchaserEmail = user.email;

      const productsPurchase = await ticketService.VerifyStockPurchase(cart);

      const productsTicket = productsPurchase.filter((product) => product.status === true);
      const productsNotProcessed = productsPurchase.filter((product) => product.status === false);

      const amount = await ticketService.calculateTotalAmount(cart);

      const code = nanoid();

      const ticket = await ticketService.createTicket(code, amount, purchaserEmail, productsTicket);

      await ticketService.removeProcessedProducts(cid);

      return res.status(200).json({
        status: 'success',
        msg: 'Thanks for your purchase',
        ticket: ticket._id,
        productProcessed: productsTicket,
        productsNotProcessed: productsNotProcessed,
      });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

export const ticketController = new TicketController();

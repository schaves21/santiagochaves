import TicketDTO from './DTO/tickets.dto.js';
import { ticketService } from '../services/tickets.service.js';
import { cartService } from '../services/carts.service.js';

class TicketController {
  async getTicket(req, res) {
    try {
      const { tid } = req.params;
      const ticket = await ticketService.getTicket(tid);
      const cartid = ticket.cartId;
      const products = await cartService.readById(cartid);
      return res.status(201).json({
        status: 'success',
        msg: 'Ticket Details',
        payload: {
          id: ticket._id,
          code: ticket.code,
          dateTime: ticket.purchase_datetime,
          user: ticket.purchaser,
          cartId: ticket.cartId,
          products: products.products,
          totalPurchase: ticket.amount,
        },
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: 'Server error' });
    }
  }

  async create(req, res) {
    try {
      const user = req.session.user;
      const { usuario, cart_id, total } = req.body.cartData;
      const purchase = new TicketDTO({
        usuario,
        cart_id,
        total,
      });

      console.log(user);
      console.log(purchase);

      const cartData = await cartService.readById(cart_id);
      console.log(cartData.products);
      const newTicket = await ticketService.create(purchase, cartData.products, user);
      return res.status(201).json({
        status: 'success',
        msg: 'Product Created',
        payload: {
          newTicket,
        },
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  }
}

export const ticketController = new TicketController();

import { ticketService } from '../services/tickets.service.js';
import { productService } from '../services/products.service.js';
import { cartService } from '../services/carts.service.js';
import { format } from 'date-fns';

class PurchasesController {
  async get(req, res) {
    try {
      const user = req.session.user;
      const cart = await cartService.readById(user.cartId);
      const tickets = await ticketService.getAll(cart._id);

      const formattedTickets = [];

      for (const ticket of tickets) {
        const productIds = ticket.products.map((product) => product.product);
        const productsList = await productService.readByIds(productIds);

        const products = productsList.map((product, index) => ({
          title: product.title,
          image: product.thumbnail,
          quantity: ticket.products[index].quantity,
        }));

        const formattedDate = format(new Date(ticket.purchase_datetime), 'dd/MM/yyyy HH:mm');

        formattedTickets.push({
          code: ticket.code,
          purchase_datetime: formattedDate,
          amount: ticket.amount,
          products: products,
        });
      }

      const title = 'List of purchases made';
      res.status(200).render('purchases', {
        user,
        title,
        formattedTickets,
      });
    } catch (e) {
      console.log(e);
    }
  }
}

export const purchasesController = new PurchasesController();

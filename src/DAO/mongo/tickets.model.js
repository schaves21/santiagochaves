import { ticketMongoose } from '../mongo/schemas/tickets.mongoose.js';
import { logger } from '../../utils/logger.js';

export default class TicketModel {
  constructor() {}
  async getAllTickets() {
    try {
      const ticket = await ticketMongoose.find({});
      return ticket;
    } catch (err) {
      logger.error(err);
    }
  }

  async getTicketById(ticketId) {
    try {
      const ticket = await ticketMongoose.findById(ticketId).populate('products.productId');
      return ticket;
    } catch (err) {
      logger.error(err);
    }
  }

  async createTicket(ticket) {
    try {
      const newTicket = await ticketMongoose.create(ticket);
      return newTicket;
    } catch (err) {
      logger.error(err);
    }
  }
}

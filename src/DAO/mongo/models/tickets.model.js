import { ticketMongoose } from '../tickets.mongoose.js';

class TicketModel {
  async getTicket(tid) {
    try {
      const ticket = await ticketMongoose.findOne({ tid });
      return ticket;
    } catch (error) {
      throw error;
    }
  }

  async getAll(cartId) {
    try {
      const tickets = await ticketMongoose.find({ cartId });
      return tickets;
    } catch (error) {
      throw error;
    }
  }

  async create(purchase) {
    try {
      const newTicket = await ticketMongoose.create(purchase);
      return newTicket;
    } catch (error) {
      throw error;
    }
  }
}

export const ticketModel = new TicketModel();

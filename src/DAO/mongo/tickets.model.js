import { ticketMongoose } from '../mongo/schemas/tickets.mongoose.js';

class TicketModel {
  async getAll() {
    try {
      const ticket = await ticketMongoose.find({});
      if (!ticket) {
        throw new Error('Ticket not found');
      }
      return ticket;
    } catch (error) {
      throw error;
    }
  }

  async getTicketById(ticketId) {
    try {
      const ticket = await ticketMongoose.findById(ticketId).populate('products.productId');
      if (!ticket) {
        throw new Error('Ticket not found');
      }
      return ticket;
    } catch (error) {
      throw error;
    }
  }

  async createTicket(ticket) {
    try {
      const newTicket = await ticketMongoose.create(ticket);
      return newTicket;
    } catch (error) {
      throw error;
    }
  }
}

export const ticketModel = new TicketModel();

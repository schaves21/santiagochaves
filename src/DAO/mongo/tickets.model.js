import { ticketMongoose } from '../mongo/schemas/tickets.mongoose.js';
import { CustomError } from '../../utils/errors/custom-error.js';
import { EErrors } from '../../utils/errors/dictionary-error.js';

class TicketModel {
  async getAllTickets() {
    try {
      const ticket = await ticketMongoose.find({});
      if (!ticket) {
        throw new CustomError(EErrors.TICKET_NOT_FOUND.code, EErrors.TICKET_NOT_FOUND.name, EErrors.TICKET_NOT_FOUND.cause, EErrors.TICKET_NOT_FOUND.message);
      }
      return ticket;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
    }
  }

  async getTicketById(ticketId) {
    try {
      const ticket = await ticketMongoose.findById(ticketId).populate('products.productId');
      if (!ticket) {
        throw new CustomError(EErrors.TICKET_NOT_FOUND.code, EErrors.TICKET_NOT_FOUND.name, EErrors.TICKET_NOT_FOUND.cause, EErrors.TICKET_NOT_FOUND.message);
      }
      return ticket;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
    }
  }

  async createTicket(ticket) {
    try {
      const newTicket = await ticketMongoose.create(ticket);
      if (!newTicket) {
        throw new CustomError(EErrors.TICKET_NOT_FOUND.code, EErrors.TICKET_NOT_FOUND.name, EErrors.TICKET_NOT_FOUND.cause, EErrors.TICKET_NOT_FOUND.message);
      }
      return newTicket;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
    }
  }
}

export const ticketModel = new TicketModel();

import express from 'express';
import { ticketController } from '../controllers/tickets.controller.js';
import { checkUser } from '../middlewares/auth.js';

export const ticketRouter = express.Router();

ticketRouter.get('/', checkUser, ticketController.getAllTickets);
ticketRouter.get('/:tid', checkUser, ticketController.getTicketById);

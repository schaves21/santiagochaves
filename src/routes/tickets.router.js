import express from 'express';
import { ticketController } from '../controllers/tickets.controller.js';

export const ticketRouter = express.Router();

ticketRouter.get('/', ticketController.getAllTickets);
ticketRouter.get('/:tid', ticketController.getTicketById);

import express from 'express';
import { ticketController } from '../controllers/tickets.controller.js';

export const ticketRouter = express.Router();

ticketRouter.get('/', ticketController.getAll);
ticketRouter.get('/:tid', ticketController.getTicketById);

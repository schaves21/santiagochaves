import express from 'express';
import { ticketController } from '../controllers/tickets.controller.js';

export const ticketRouter = express.Router();

ticketRouter.get('/:tid', ticketController.getTicket);
ticketRouter.post('/:cid/purchase', ticketController.create);

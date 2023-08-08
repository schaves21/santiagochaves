import express from 'express';
import { purchasesController } from '../controllers/purchases.controller.js';

export const purchasesRouter = express.Router();

purchasesRouter.get('/', purchasesController.get);

import express from 'express';
import { recoverController } from '../controllers/recover.controller.js';

export const recoverRouter = express.Router();

recoverRouter.get('/recover-mail', recoverController.getRecoverMail);
recoverRouter.post('/recover-mail', recoverController.createRecoverMail);
recoverRouter.get('/recover-pass', recoverController.getRecoverPassword);
recoverRouter.post('/recover-pass', recoverController.updateRecoverPassword);

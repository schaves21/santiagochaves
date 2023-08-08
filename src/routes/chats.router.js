import express from 'express';
import { checkUser } from '../middlewares/auth.js';

export const chatsRouter = express.Router();

chatsRouter.get('/', checkUser, (_, res) => {
  return res.status(200).render('chat', {});
});

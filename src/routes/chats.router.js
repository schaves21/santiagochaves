import express from 'express';

export const chatsRouter = express.Router();

chatsRouter.get('/', (_, res) => {
  return res.status(200).render('chat', {});
});

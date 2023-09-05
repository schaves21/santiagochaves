import express from 'express';
import { userController } from '../controllers/users.controller.js';
import { checkAdmin } from '../middlewares/auth.js';

export const usersRouter = express.Router();

usersRouter.get('/', userController.getAllUsers);
usersRouter.get('/:uid', userController.getUserById);
usersRouter.post('/', checkAdmin, userController.create);
usersRouter.put('/:uid', checkAdmin, userController.updateOne);
usersRouter.delete('/:uid', checkAdmin, userController.deleteOne);
usersRouter.put('/premium/:uid', userController.updateRole);

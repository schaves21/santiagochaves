import express from 'express';
import upload from '../middlewares/multer.js';
import { userController } from '../controllers/users.controller.js';
import { checkAdmin } from '../middlewares/auth.js';

export const usersRouter = express.Router();

usersRouter.get('/', checkAdmin, userController.getAllUsers);
usersRouter.get('/:uid', checkAdmin, userController.getUserById);
usersRouter.post('/', checkAdmin, userController.create);
usersRouter.put('/:uid', checkAdmin, userController.updateOne);
usersRouter.delete('/:uid', checkAdmin, userController.deleteOne);
usersRouter.put('/premium/:uid', userController.updateRole);
usersRouter.post('/:uid/documents', upload.array('documents', 5), userController.uploadDocuments);

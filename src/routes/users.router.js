import express from 'express';
import upload from '../middlewares/multer.js';
import { userController } from '../controllers/users.controller.js';
import { checkAdmin } from '../middlewares/auth.js';

export const usersRouter = express.Router();

usersRouter.get('/', checkAdmin, userController.getAllUsers);
usersRouter.get('/basic-data', checkAdmin, userController.getBasicDataUsers);
usersRouter.get('/:uid', checkAdmin, userController.getUserById);
usersRouter.post('/', checkAdmin, userController.create);
usersRouter.put('/:uid', checkAdmin, userController.updateOne);
usersRouter.delete('/:uid', checkAdmin, userController.deleteOne);
usersRouter.delete('/', checkAdmin, userController.deleteInactiveUsers); /* --- ELIMINAR USUARIOS INACTIVOS EN LOS ULTIMOS 2 DIAS --- */
usersRouter.put('/premium/:uid', checkAdmin, userController.updateRole); /* --- ROLE = USER CONTROLAR DOCUMENTOS REQUERIDOS --------- */

/* ------------- EL POST DEBE REALIZARSE CON POSTMAN ------------- */
usersRouter.post('/:uid/documents', upload.array('documents', 5), userController.uploadDocuments);

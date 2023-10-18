import express from 'express';
import passport from 'passport';
import { authController } from '../controllers/auth.controller.js';

export const authRouter = express.Router();

authRouter.post('/login', passport.authenticate('login', { failureRedirect: '/error' }), authController.authLogin);
authRouter.post('/register', passport.authenticate('register', { failureRedirect: '/error' }), authController.authRegister);
authRouter.get('/current', authController.getCurrent);

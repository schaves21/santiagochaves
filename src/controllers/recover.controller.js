import { recoverService } from '../services/recover.service.js';
import RecoverDTO from './DTO/recover.dto.js';
import env from '../config/enviroment.config.js';
import { CustomError } from '../utils/errors/custom-error.js';
import { EErrors } from '../utils/errors/dictionary-error.js';
import { logger } from '../utils/logger.js';
import { transport } from '../utils/nodemailer.js';
import { randomBytes } from 'crypto';

class RecoverController {
  async getRecoverMail(_, res, next) {
    try {
      res.render('recover-mail');
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  }

  async createRecoverMail(req, res, next) {
    try {
      const { email } = req.body;

      logger.debug(email);

      const token = randomBytes(20).toString('hex');
      const expire = Date.now() + 3600000;

      let recoverDTO = new RecoverDTO({ email, token, expire });
      const tokenSaved = await recoverService.createRecoverMail(recoverDTO);

      if (!tokenSaved) {
        throw new CustomError(EErrors.TOKEN_NOT_FOUND.code, EErrors.TOKEN_NOT_FOUND.name, EErrors.TOKEN_NOT_FOUND.cause, EErrors.TOKEN_NOT_FOUND.message);
      }

      const result = await transport.sendMail({
        from: env.googleMail,
        to: email,
        subject: 'Reset password',
        html: `
        <div>
          <p>Your code to change password is ${token}</p>
          <a href="${env.apiUrl}/recover-pass?token=${token}&email=${email}">To recover your password click on the following link</a>				
        </div>
        `,
      });

      if (result) {
        res.send(`Email sent to: ${email}`);
      } else {
        logger.debug('Result of sending email:', result);
        res.render('error', { error: 'Check your email' });
      }
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  }

  async getRecoverPassword(req, res, next) {
    try {
      const { token, email } = req.query;
      const foundToken = await recoverService.getRecoverPassword(token, email);

      if (foundToken) {
        res.render('recover-pass', { token, email });
      } else {
        //res.render('error', { error: 'Token expired or invalid token' });
        res.render('error', { error: 'Token expired or invalid token' }, `<a href="${env.apiUrl}/recover-mail">Make a new request to recover your password</a>`);
      }
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  }

  async updateRecoverPassword(req, res, next) {
    try {
      let { token, email, password } = req.body;

      const updatePassword = await recoverService.updateRecoverPassword(token, email, password);

      if (updatePassword) {
        res.redirect('/login');
      } else {
        res.render('error', { error: 'Token expired or invalid token' });
      }
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  }
}

export const recoverController = new RecoverController();

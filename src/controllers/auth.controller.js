import AuthDTO from './DTO/auth.dto.js';
import { CustomError } from '../utils/errors/custom-error.js';
import { EErrors } from '../utils/errors/dictionary-error.js';
import { logger } from '../utils/logger.js';

class AuthController {
  async authLogin(req, res, next) {
    try {
      if (!req.user) {
        logger.info('No user found in the request object');
        throw new CustomError(EErrors.INVALID_EMAIL_PASSWORD.code, EErrors.INVALID_EMAIL_PASSWORD.name, EErrors.INVALID_EMAIL_PASSWORD.cause, EErrors.INVALID_EMAIL_PASSWORD.message);
      }

      req.session.user = {
        _id: req.user._id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        age: req.user.age,
        cartID: req.user.cartID,
        rol: req.user.rol,
      };

      return res.redirect('/menu');
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  }

  async authRegister(req, res, next) {
    try {
      if (!req.user) {
        logger.info('No user found in the request object');
        throw new CustomError(EErrors.INVALID_EMAIL_PASSWORD.code, EErrors.INVALID_EMAIL_PASSWORD.name, EErrors.INVALID_EMAIL_PASSWORD.cause, EErrors.INVALID_EMAIL_PASSWORD.message);
      }
      req.session.user = {
        _id: req.user._id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        age: req.user.age,
        cartID: req.user.cartID,
        rol: req.user.rol,
      };
      return res.redirect('/menu');
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  }

  async getCurrent(req, res, next) {
    try {
      const { firstName, lastName, email, rol } = req.session.user;
      const authDTO = new AuthDTO({ firstName, lastName, email, rol });
      const authUser = {
        firstName: authDTO.firstName,
        lastName: authDTO.lastName,
        email: authDTO.email,
        role: authDTO.rol,
      };

      logger.debug(JSON.stringify(authDTO));

      return res.status(200).json({
        status: 'success',
        msg: 'User session data',
        data: { user: authUser },
      });
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  }
}

export const authController = new AuthController();

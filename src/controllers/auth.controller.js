import AuthDTO from './DTO/auth.dto.js';
import { CustomError } from '../utils/errors/custom-error.js';
import { EErrors } from '../utils/errors/dictionary-error.js';

class AuthController {
  async authLogin(req, res, next) {
    try {
      if (!req.user) {
        //return res.json({ error: 'Invalid credentials' });
        throw new CustomError(EErrors.INVALID_EMAIL_PASSWORD.code, EErrors.INVALID_EMAIL_PASSWORD.name, EErrors.INVALID_EMAIL_PASSWORD.cause, EErrors.INVALID_EMAIL_PASSWORD.message);
      }

      req.session.user = {
        _id: req.user._id.toString(),
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        age: req.user.age,
        rol: req.user.rol,
      };

      return res.redirect('/products');
    } catch (err) {
      next(err);
    }
    /*  
    } catch (error) {
      //res.status(404).json({ message: error.message });
      throw error;
    }
    */
  }

  async authRegister(req, res, next) {
    try {
      if (!req.user) {
        //console.log(req.user);
        //return res.json({ error: 'Something went wrong' });
        throw new CustomError(EErrors.INVALID_EMAIL_PASSWORD.code, EErrors.INVALID_EMAIL_PASSWORD.name, EErrors.INVALID_EMAIL_PASSWORD.cause, EErrors.INVALID_EMAIL_PASSWORD.message);
      }
      req.session.user = {
        _id: req.user._id.toString(),
        email: req.user.email,
        firstName: req.user.firstName,
        rol: req.user.rol,
      };

      return res.redirect('/products');
    } catch (err) {
      next(err);
    }
    /*
    } catch (error) {
      //res.status(404).json({ message: error.message });
      throw error;
    }
    */
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
      return res.status(200).json({
        status: 'success',
        msg: 'User session data',
        data: { user: authUser },
      });
    } catch (err) {
      next(err);
    }
    /*  
    } catch (e) {
      console.log(e);
    }
    */
  }
}

export const authController = new AuthController();

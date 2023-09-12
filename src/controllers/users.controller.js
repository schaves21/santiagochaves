import { userService } from '../services/users.service.js';
import { cartService } from '../services/carts.service.js';
import AuthDTO from './DTO/auth.dto.js';
import { CustomError } from '../utils/errors/custom-error.js';
import { EErrors } from '../utils/errors/dictionary-error.js';
import { logger } from '../utils/logger.js';
import { createHash } from '../config.js';

class UserController {
  async getAllUsers(_, res, next) {
    try {
      const user = await userService.getAllUsers();
      if (user) {
        return res.status(200).json({
          status: 'success',
          msg: 'User list',
          data: user,
        });
      } else {
        throw new CustomError(EErrors.USER_NOT_FOUND.code, EErrors.USER_NOT_FOUND.name, EErrors.USER_NOT_FOUND.cause, EErrors.USER_NOT_FOUND.message);
      }
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  }

  async getUserById(req, res, next) {
    try {
      const { uid } = req.params;

      logger.debug(`User id received by parameter: ${uid}`);

      const user = await userService.getUserById(uid);

      if (user) {
        return res.status(200).json({
          status: 'success',
          msg: 'User',
          data: user,
        });
      } else {
        throw new CustomError(EErrors.USER_NOT_FOUND.code, EErrors.USER_NOT_FOUND.name, EErrors.USER_NOT_FOUND.cause, EErrors.USER_NOT_FOUND.message);
      }
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const { firstName, lastName, email, age, password } = req.body;

      const newCart = await cartService.create();

      if (newCart) {
        const cartID = newCart._id.toString();

        const newUser = new AuthDTO({
          firstName,
          lastName,
          email,
          age,
          password: createHash(password),
          cartID,
          rol: 'user',
        });

        const userCreated = await userService.create(newUser);

        if (userCreated) {
          return res.status(201).json({
            status: 'success',
            msg: 'User created',
            data: {},
          });
        } else {
          throw new CustomError(EErrors.USER_NOT_FOUND.code, EErrors.USER_NOT_FOUND.name, EErrors.USER_NOT_FOUND.cause, EErrors.USER_NOT_FOUND.message);
        }
      }
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  }

  async updateOne(req, res) {
    try {
      const { uid } = req.params;
      const { firstName, lastName, email, age, password } = req.body;
      let user = new AuthDTO({ firstName, lastName, email, age, password });

      const userUpdated = await userService.updateOne(uid, user);

      if (userUpdated) {
        return res.status(200).json({
          status: 'success',
          msg: 'User uptaded',
          data: {},
        });
      } else {
        throw new CustomError(EErrors.USER_NOT_FOUND.code, EErrors.USER_NOT_FOUND.name, EErrors.USER_NOT_FOUND.cause, EErrors.USER_NOT_FOUND.message);
      }
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  }

  async deleteOne(req, res, next) {
    try {
      const { uid } = req.params;

      logger.debug(`User id received by parameter: ${uid}`);

      const userDeleted = await userService.deleteOne(uid);
      if (userDeleted) {
        return res.status(200).json({
          status: 'success',
          msg: 'User deleted',
          data: userDeleted,
        });
      } else {
        throw new CustomError(EErrors.USER_NOT_FOUND.code, EErrors.USER_NOT_FOUND.name, EErrors.USER_NOT_FOUND.cause, EErrors.USER_NOT_FOUND.message);
      }
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  }

  async updateRole(req, res, next) {
    try {
      const userId = req.params.uid;

      logger.debug(`User id received by parameter: ${userId}`);

      const user = await userService.updateRole(userId);
      if (user) {
        return res.status(200).json({
          status: 'success',
          msg: 'Role updated',
          data: {},
        });
      } else {
        throw new CustomError(EErrors.USER_NOT_FOUND.code, EErrors.USER_NOT_FOUND.name, EErrors.USER_NOT_FOUND.cause, EErrors.USER_NOT_FOUND.message);
      }
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  }
}

export const userController = new UserController();

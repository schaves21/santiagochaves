import { UserModel } from '../DAO/factory.js';
import { CustomError } from '../utils/errors/custom-error.js';
import { EErrors } from '../utils/errors/dictionary-error.js';
import { logger } from '../utils/logger.js';

const userModel = new UserModel();

class UserService {
  async getAllUsers() {
    try {
      const user = await userModel.getAllUsers();
      if (!user) {
        throw new CustomError(EErrors.USER_NOT_FOUND.code, EErrors.USER_NOT_FOUND.name, EErrors.USER_NOT_FOUND.cause, EErrors.USER_NOT_FOUND.message);
      }
      return user;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }

  async getUserById(uid) {
    try {
      const user = await userModel.getUserById(uid);
      logger.debug(`User Id found in BD: ${uid}`);
      if (!user) {
        throw new CustomError(EErrors.USER_NOT_FOUND.code, EErrors.USER_NOT_FOUND.name, EErrors.USER_NOT_FOUND.cause, EErrors.USER_NOT_FOUND.message);
      }
      return user;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }

  async create(newUser) {
    try {
      const userCreated = await userModel.create(newUser);
      if (!userCreated) {
        throw new CustomError(EErrors.USER_NOT_FOUND.code, EErrors.USER_NOT_FOUND.name, EErrors.USER_NOT_FOUND.cause, EErrors.USER_NOT_FOUND.message);
      }
      return userCreated;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }

  async updateOne(uid, user) {
    try {
      const userUpdated = await userModel.updateOne(uid, user);
      if (!userUpdated) {
        throw new CustomError(EErrors.USER_NOT_FOUND.code, EErrors.USER_NOT_FOUND.name, EErrors.USER_NOT_FOUND.cause, EErrors.USER_NOT_FOUND.message);
      }
      return userUpdated;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }

  async deleteOne(uid) {
    try {
      const user = await userModel.deleteOne(uid);
      logger.debug(`User Id found in BD: ${uid}`);
      if (!user) {
        throw new CustomError(EErrors.USER_NOT_FOUND.code, EErrors.USER_NOT_FOUND.name, EErrors.USER_NOT_FOUND.cause, EErrors.USER_NOT_FOUND.message);
      }
      return user;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }

  async updateRole(userId) {
    try {
      const userFound = await this.getUserById(userId);

      if (userFound.rol === 'premium') {
        userFound.rol = 'user';
      } else if (userFound.rol === 'user') {
        userFound.rol = 'premium';
      } else {
        throw new CustomError(EErrors.USER_NOT_FOUND.code, EErrors.USER_NOT_FOUND.name, EErrors.USER_NOT_FOUND.cause, EErrors.USER_NOT_FOUND.message);
      }

      logger.debug(`Role: ${userFound.rol}`);

      const updatedRole = await userFound.save();
      return updatedRole;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }
}
export const userService = new UserService();

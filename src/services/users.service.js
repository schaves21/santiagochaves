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
      return user;
    } catch (err) {
      logger.error(err);
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await userModel.getUserByEmail(email);

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

  async getUserByCartID(cid) {
    try {
      const user = await userModel.getUserByCartID(cid);
      return user;
    } catch (err) {
      logger.error(err);
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

  async requiredDocuments(user) {
    try {
      const requiredDocs = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
      const userDocuments = user.documents.map((doc) => doc.name);

      logger.info(`Documents: ${userDocuments}`);

      for (const doc of requiredDocs) {
        if (!userDocuments.includes(doc)) {
          return false;
        }
      }
      return true;
    } catch (err) {
      throw err;
    }
  }

  async updateRole(userId) {
    try {
      const user = await this.getUserById(userId);

      if (!user) {
        throw new CustomError(EErrors.USER_NOT_FOUND.code, EErrors.USER_NOT_FOUND.name, EErrors.USER_NOT_FOUND.cause, EErrors.USER_NOT_FOUND.message);
      } else {
        if (user.rol === 'user') {
          // solo si el usuario es igual a user comprobar documentos requeridos
          const requiredDocs = await this.requiredDocuments(user);
          if (requiredDocs) {
            user.rol = 'premium';
          } else {
            throw new CustomError(EErrors.INCOMPLETE_USER_DOCUMENT.code, EErrors.INCOMPLETE_USER_DOCUMENT.name, EErrors.INCOMPLETE_USER_DOCUMENT.cause, EErrors.INCOMPLETE_USER_DOCUMENT.message);
          }
        } else if (user.rol === 'premium') {
          user.rol = 'user';
        }
      }

      logger.debug(`Role: ${user.rol}`);

      const updatedRole = await user.save();
      return updatedRole;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }

  async uploadDocuments(uid, name, documentURL) {
    try {
      await userModel.uploadDocuments(uid, name, documentURL);
    } catch (err) {
      throw err;
    }
  }
}
export const userService = new UserService();

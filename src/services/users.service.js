import { UserModel } from '../DAO/factory.js';
import { CustomError } from '../utils/errors/custom-error.js';
import { EErrors } from '../utils/errors/dictionary-error.js';
import { logger } from '../utils/logger.js';

const userModel = new UserModel();

class UserService {
  async getAllUsers() {
    try {
      const user = await userModel.getAllUsers();
      return user;
    } catch (err) {
      logger.error(err);
    }
  }

  async getBasicDataUsers() {
    try {
      const user = await userModel.getBasicDataUsers();
      return user;
    } catch (err) {
      logger.error(err);
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
      return user;
    } catch (err) {
      logger.error(err);
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
      return userCreated;
    } catch (err) {
      logger.error(err);
    }
  }

  async updateOne(uid, user) {
    try {
      const userUpdated = await userModel.updateOne(uid, user);
      return userUpdated;
    } catch (err) {
      logger.error(err);
    }
  }

  async deleteOne(uid) {
    try {
      const user = await userModel.deleteOne(uid);
      logger.debug(`User Id found in BD: ${uid}`);
      return user;
    } catch (err) {
      logger.error(err);
    }
  }

  async deleteInactiveUsers(days) {
    try {
      const inactiveUsers = await userModel.findInactiveUsers(days);

      await userModel.deleteInactiveUsers(inactiveUsers);

      return inactiveUsers;
    } catch (err) {
      logger.error(err);
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
      logger.error(err);
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
      logger.error(err);
    }
  }

  async uploadDocuments(uid, name, documentURL) {
    try {
      await userModel.uploadDocuments(uid, name, documentURL);
    } catch (err) {
      logger.error(err);
    }
  }
}
export const userService = new UserService();

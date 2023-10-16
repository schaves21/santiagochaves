import { RecoverModel } from '../DAO/factory.js';
import { createHash } from '../config.js';
import { CustomError } from '../utils/errors/custom-error.js';
import { EErrors } from '../utils/errors/dictionary-error.js';

const recoverModel = new RecoverModel();

class RecoverService {
  async getRecoverPassword(token, email) {
    try {
      const foundToken = await recoverModel.getRecoverPassword(token, email);

      if (foundToken && foundToken.expire > Date.now()) {
        return foundToken;
      } else {
        throw new CustomError(EErrors.TOKEN_NOT_FOUND.code, EErrors.TOKEN_NOT_FOUND.name, EErrors.TOKEN_NOT_FOUND.cause, EErrors.TOKEN_NOT_FOUND.message);
      }
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }

  async createRecoverMail(recover) {
    try {
      const recoverMail = await recoverModel.createRecoverMail(recover);
      if (!recoverMail) {
        throw new CustomError(EErrors.TOKEN_NOT_FOUND.code, EErrors.TOKEN_NOT_FOUND.name, EErrors.TOKEN_NOT_FOUND.cause, EErrors.TOKEN_NOT_FOUND.message);
      }
      return recoverMail;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }

  async updateRecoverPassword(token, email, password) {
    try {
      const foundToken = await recoverModel.getRecoverPassword(token, email);

      if (foundToken && foundToken.expire > Date.now() && password) {
        password = createHash(password);
        const updatedUser = await recoverModel.updateRecoverPassword(email, password);

        if (!updatedUser) {
          throw new CustomError(EErrors.USER_NOT_FOUND.code, EErrors.USER_NOT_FOUND.name, EErrors.USER_NOT_FOUND.cause, EErrors.USER_NOT_FOUND.message);
        }
        return updatedUser;
      }
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }
}

export const recoverService = new RecoverService();

import { recoverMongoose } from '../mongo/schemas/recover.mongoose.js';
import { UserMongoose } from '../mongo/schemas/users.mongoose.js';
import { CustomError } from '../../utils/errors/custom-error.js';
import { EErrors } from '../../utils/errors/dictionary-error.js';

export default class RecoverModel {
  constructor() {}
  async getRecoverPassword(token, email) {
    try {
      const foundToken = await recoverMongoose.findOne({ token, email });
      if (!foundToken) {
        throw new CustomError(EErrors.TOKEN_NOT_FOUND.code, EErrors.TOKEN_NOT_FOUND.name, EErrors.TOKEN_NOT_FOUND.cause, EErrors.TOKEN_NOT_FOUND.message);
      }
      return foundToken;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }
  async createRecoverMail(recover) {
    try {
      const recoverCreated = await recoverMongoose.create(recover);
      if (!recoverCreated) {
        throw new CustomError(EErrors.TOKEN_NOT_FOUND.code, EErrors.TOKEN_NOT_FOUND.name, EErrors.TOKEN_NOT_FOUND.cause, EErrors.TOKEN_NOT_FOUND.message);
      }
      return recoverCreated;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }
  async updateRecoverPassword(email, password) {
    try {
      const foundUser = await UserMongoose.updateOne({ email }, { password });
      if (!foundUser) {
        throw new CustomError(EErrors.USER_NOT_FOUND.code, EErrors.USER_NOT_FOUND.name, EErrors.USER_NOT_FOUND.cause, EErrors.USER_NOT_FOUND.message);
      }
      return foundUser;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }
}

import { recoverMongoose } from '../mongo/schemas/recover.mongoose.js';
import { UserMongoose } from '../mongo/schemas/users.mongoose.js';
import { logger } from '../../utils/logger.js';

export default class RecoverModel {
  constructor() {}
  async getRecoverPassword(token, email) {
    try {
      const foundToken = await recoverMongoose.findOne({ token, email });
      return foundToken;
    } catch (err) {
      logger.error(err);
    }
  }
  async createRecoverMail(recover) {
    try {
      const recoverCreated = await recoverMongoose.create(recover);
      return recoverCreated;
    } catch (err) {
      logger.error(err);
    }
  }
  async updateRecoverPassword(email, password) {
    try {
      const foundUser = await UserMongoose.updateOne({ email }, { password });
      return foundUser;
    } catch (err) {
      logger.error(err);
    }
  }
}

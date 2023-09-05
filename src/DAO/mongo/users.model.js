import { UserMongoose } from '../mongo/schemas/users.mongoose.js';
import { CustomError } from '../../utils/errors/custom-error.js';
import { EErrors } from '../../utils/errors/dictionary-error.js';

export default class UserModel {
  constructor() {}
  async getAllUsers() {
    try {
      const user = await UserMongoose.find({});
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
      const user = await UserMongoose.findById({ _id: uid });
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

  async create() {
    try {
      const userCreated = await UserMongoose.create({});
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
      const userUpdated = await UserMongoose.findByIdAndUpdate(uid, { user }, { new: true });
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
      const userDeleted = await UserMongoose.deleteOne({ uid });
      if (userDeleted.deletedCount === 1) {
        return true;
      } else {
        throw new CustomError(EErrors.USER_NOT_FOUND.code, EErrors.USER_NOT_FOUND.name, EErrors.USER_NOT_FOUND.cause, EErrors.USER_NOT_FOUND.message);
      }
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }
}

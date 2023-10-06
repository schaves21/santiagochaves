import { UserMongoose } from '../mongo/schemas/users.mongoose.js';
import { CustomError } from '../../utils/errors/custom-error.js';
import { EErrors } from '../../utils/errors/dictionary-error.js';
import mongoose from 'mongoose';
import { logger } from '../../utils/logger.js';

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
      if (!mongoose.Types.ObjectId.isValid(uid)) {
        return null;
      }

      const user = await UserMongoose.findById(uid);
      return user;
    } catch (err) {
      throw err;
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await UserMongoose.findOne({ email });
      return user || null;
    } catch (err) {
      throw err;
    }
  }

  async getUserByCartID(cartID) {
    try {
      const user = await UserMongoose.findOne({ cartID });
      return user || null;
    } catch (err) {
      logger.error(err);
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

  async uploadDocuments(uid, name, documentURL) {
    try {
      await UserMongoose.updateOne(
        { _id: uid },
        {
          $push: {
            documents: {
              name: name,
              reference: documentURL,
              status: 'Uploaded',
            },
          },
        }
      );
    } catch (err) {
      throw err;
    }
  }
}

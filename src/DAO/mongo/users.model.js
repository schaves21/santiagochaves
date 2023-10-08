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
      return user;
    } catch (err) {
      logger.error(err);
    }
  }

  async getBasicDataUsers() {
    try {
      const user = await UserMongoose.find(
        {},
        {
          _id: false,
          firstName: true,
          lastName: true,
          email: true,
          rol: true,
        }
      );

      return user;
    } catch (err) {
      logger.error(err);
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
      logger.error(err);
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await UserMongoose.findOne({ email });
      return user || null;
    } catch (err) {
      logger.error(err);
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
      return userCreated;
    } catch (err) {
      logger.error(err);
    }
  }

  async updateOne(uid, user) {
    try {
      const userUpdated = await UserMongoose.findByIdAndUpdate(uid, { user }, { new: true });
      return userUpdated;
    } catch (err) {
      logger.error(err);
    }
  }

  async deleteOne(uid) {
    try {
      const userDeleted = await UserMongoose.findOneAndDelete({ _id: uid });
      return userDeleted;
    } catch (err) {
      logger.error(err);
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
      logger.error(err);
    }
  }
}

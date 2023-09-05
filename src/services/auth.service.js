import { AuthModel } from '../DAO/factory.js';
import { logger } from '../utils/logger.js';

const authModel = new AuthModel();

class AuthService {
  async findById(id) {
    try {
      const user = await authModel.findById(id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (err) {
      logger.error(err.message);
    }
  }

  async findUserByEmail({ email }) {
    try {
      const user = await authModel.findUserByEmail({ email });
      return user || false;
    } catch (err) {
      logger.error(err.message);
    }
  }

  async getUserById(cartID) {
    try {
      const user = await authModel.getUserById(cartID);
      return user;
    } catch (err) {
      logger.error(err.message);
    }
  }

  async create(newUser) {
    try {
      const userCreated = await authModel.create(newUser);
      return userCreated;
    } catch (err) {
      logger.error(err.message);
    }
  }
}
export const authService = new AuthService();

/*
import { authModel } from '../DAO/mongo/auth.model.js';
import { logger } from '../utils/logger.js';

class AuthService {
  async findById(id) {
    try {
      const user = await authModel.findById(id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (err) {
      logger.error(err.message);
    }
  }

  async findUserByEmail({ email }) {
    try {
      const user = await authModel.findUserByEmail({ email });
      return user || false;
    } catch (err) {
      logger.error(err.message);
    }
  }

  async getUserById(cartID) {
    try {
      const user = await authModel.getUserById(cartID);
      return user;
    } catch (err) {
      logger.error(err.message);
    }
  }

  async create(newUser) {
    try {
      const userCreated = await authModel.create(newUser);
      return userCreated;
    } catch (err) {
      logger.error(err.message);
    }
  }
}

export const authService = new AuthService();
*/

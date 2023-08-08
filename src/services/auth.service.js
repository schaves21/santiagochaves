//import { authModel } from '../DAO/factory.js';
import { authModel } from '../DAO/mongo/models/auth.model.js';

class AuthService {
  async findById(id) {
    try {
      const user = await authModel.findById(id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findUserByEmail({ email }) {
    try {
      const user = await authModel.findUserByEmail({ email });
      return user || false;
    } catch (error) {
      throw error;
    }
  }

  async create(newUser) {
    try {
      const userCreated = await authModel.create(newUser);
      return userCreated;
    } catch (error) {
      throw error;
    }
  }
}

export const authService = new AuthService();

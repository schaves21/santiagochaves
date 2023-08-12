import { UserMongoose } from '../mongo/schemas/users.mongoose.js';

class AuthModel {
  async findById(id) {
    try {
      const user = await UserMongoose.findById(id);
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
      const user = await UserMongoose.findOne(
        { email: email },
        {
          _id: true,
          email: true,
          firstName: true,
          lastName: true,
          password: true,
          age: true,
          rol: true,
        }
      );
      return user || false;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(cartID) {
    try {
      const user = await UserMongoose.findOne({ cartID: cartID });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async create(newUser) {
    try {
      const userCreated = await UserMongoose.create(newUser);
      return userCreated;
    } catch (error) {
      throw error;
    }
  }
}

export const authModel = new AuthModel();

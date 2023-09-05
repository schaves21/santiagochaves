import { UserMongoose } from '../mongo/schemas/users.mongoose.js';

export default class AuthModel {
  constructor() {}
  async findById(id) {
    try {
      const user = await UserMongoose.findById(id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (err) {
      throw err;
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
          cartID: true,
        }
      );
      return user || false;
    } catch (err) {
      throw err;
    }
  }

  async getUserById(cartID) {
    try {
      const user = await UserMongoose.findOne({ cartID: cartID });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (err) {
      throw err;
    }
  }

  async create(newUser) {
    try {
      const userCreated = await UserMongoose.create(newUser);
      return userCreated;
    } catch (err) {
      throw err;
    }
  }
}

/*
import { UserMongoose } from '../mongo/schemas/users.mongoose.js';

class AuthModel {
  async findById(id) {
    try {
      const user = await UserMongoose.findById(id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (err) {
      throw err;
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
          cartID: true,
        }
      );
      return user || false;
    } catch (err) {
      throw err;
    }
  }

  async getUserById(cartID) {
    try {
      const user = await UserMongoose.findOne({ cartID: cartID });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (err) {
      throw err;
    }
  }

  async create(newUser) {
    try {
      const userCreated = await UserMongoose.create(newUser);
      return userCreated;
    } catch (err) {
      throw err;
    }
  }
}

export const authModel = new AuthModel();
*/

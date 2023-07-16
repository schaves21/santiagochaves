import { UserModel } from "../dao/models/users.model.js";
import { createHash } from "../config.js";

class UserService {
  async getOne(email) {
    const users = await UserModel.findOne({ email: email });
    return users;
  }

  async findUserByEmail(email) {
    const user = await UserModel.findOne(
      { email: email },
      {
        _id: true,
        email: true,
        username: true,
        password: true,
        rol: true,
      }
    );
    return user || false;
  }

  async create({ firstName, lastName, email, age, password }) {
    const findUser = await this.findUserByEmail(email);

    if (findUser) {
      throw "User already exists";
    }

    //TODO: cuando se crea un usuario seria bueno ya crear un cart en la collection de carts y meter el id correcto aqui abajo.
    const userCreated = await UserModel.create({
      firstName,
      lastName,
      email,
      age,
      password: createHash(password),
      cart: "",
      rol: "user",
    });

    return userCreated;
  }

  async update({ id, firstName, lastName, email, password, age }) {
    const userUpdated = await UserModel.updateOne(
      { _id: id },
      { firstName, lastName, email, password, age }
    );
    return userUpdated;
  }

  async delete({ id }) {
    const userDeleted = await UserModel.deleteOne({ _id: id });
    return userDeleted;
  }
}

export const userService = new UserService();

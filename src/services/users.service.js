import { UserModel } from "../dao/models/users.model.js";

class UserService {
  async getOne(email) {
    const users = await UserModel.findOne({ email: email });
    return users;
  }

  async create({ firstName, lastName, email, password, age, isAdmin }) {
    try {
      const findUser = await UserModel.findOne({
        $or: [{ firstName: firstName }, { email: email }],
      });

      if (findUser) {
        return false;
      } else {
        const userCreated = await UserModel.create({
          firstName,
          lastName,
          email,
          password,
          age,
          isAdmin,
        });
        return userCreated;
      }
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
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

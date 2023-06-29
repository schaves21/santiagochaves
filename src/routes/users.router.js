import express from "express";
import { userService } from "../services/users.service.js";

export const usersRouter = express.Router();

usersRouter.get("/", async (req, res) => {
  try {
    const users = await userService.getAll();
    return res.status(200).json({
      status: "success",
      msg: "Users list",
      payload: users,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "Something went wrong",
      payload: {},
    });
  }
});

usersRouter.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, password, age } = req.body;
    if (!firstName || !lastName || !email || !password || !age) {
      console.log(
        "validation error: Please complete firstName, lastName, email, password and age"
      );
      return res.status(400).json({
        status: "error",
        msg: "Please complete firstName, lastName, email, password and age",
        payload: {},
      });
    }

    const isAdmin =
      email === "adminCoder@coder.com" && password === "adminCod3r123";

    if (isAdmin) {
      req.session.isAdmin = true;
    } else {
      req.session.isAdmin = false;
    }

    const userCreated = await userService.create({
      firstName,
      lastName,
      email,
      password,
      age,
      isAdmin,
    });
    return res.status(201).json({
      status: "success",
      msg: "User created",
      payload: userCreated,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong",
      payload: {},
    });
  }
});

usersRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, password, age } = req.body;
    if (!firstName || !lastName || !email || !password || !age || !id) {
      console.log(
        "validation error: Please complete firstName, lastName, email, password and age"
      );
      return res.status(404).json({
        status: "error",
        msg: "Please complete firstName, lastName, email, password and age",
        payload: {},
      });
    }
    try {
      const userUpdated = await userService.update({
        id,
        firstName,
        lastName,
        email,
        password,
        age,
      });
      if (userUpdated.matchedCount > 0) {
        return res.status(201).json({
          status: "success",
          msg: "User update",
          payload: {},
        });
      } else {
        return res.status(404).json({
          status: "error",
          msg: "User not found",
          payload: {},
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: "error",
        msg: "db server error while updating user",
        payload: {},
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "Something went wrong",
      payload: {},
    });
  }
});

usersRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await userService.delete({ id });
    return res.status(200).json({
      status: "success",
      msg: "User deleted",
      payload: {},
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "Something went wrong",
      payload: {},
    });
  }
});

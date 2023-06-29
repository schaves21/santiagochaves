import express from "express";
import { userService } from "../services/users.service.js";
import { createHash, isValidPassword } from "../config.js";

export const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, age } = req.body;
  if (!firstName || !lastName || !email || !password || !age) {
    return res.status(400).render("error", { error: "Missing data" });
  }
  try {
    const isAdmin =
      email === "adminCoder@coder.com" && password === "adminCod3r123";

    if (isAdmin) {
      req.session.isAdmin = true;
    } else {
      req.session.isAdmin = false;
    }

    await userService.create({
      firstName,
      lastName,
      email,
      password: createHash(password),
      age,
      isAdmin,
    });
    req.session.firstName = firstName;
    req.session.lastName = lastName;
    req.session.email = email;
    req.session.age = age;

    return res.redirect("/profile");
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .render("error", { error: "Check your email and try again later" });
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).render("error", { error: "Missing data" });
  }
  try {
    const foundUser = await userService.getOne(email);
    if (foundUser && isValidPassword(password, foundUser.password)) {
      req.session.firstName = foundUser.firstName;
      req.session.email = foundUser.email;
      req.session.isAdmin = foundUser.isAdmin;
      console.log(req.session.isAdmin);
      return res.redirect("/products");
    } else {
      return res
        .status(400)
        .render("error", { error: "Incorrect email or password" });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .render("error", { error: "Unexpected server error" });
  }
});

import express from "express";
import passport from "passport";

export const authRouter = express.Router();

authRouter.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/",
  }),
  async (req, res) => {
    if (!req.user) {
      return res.json({ error: "invalid credentials" });
    }
    req.session.user = {
      _id: req.user._id.toString(),
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      age: req.user.age,
      rol: req.user.rol,
    };
    return res.redirect("/products");
  }
);

authRouter.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/",
  }),
  (req, res) => {
    if (!req.user) {
      return res.json({ error: "something went wrong" });
    }
    req.session.user = {
      _id: req.user._id.toString(),
      email: req.user.email,
      firstName: req.user.firstName,
      rol: req.user.rol,
    };
    return res.redirect("/products");
  }
);

authRouter.get("/current", (req, res) => {
  console.log(req.session);
  return res.status(200).json({
    status: "success",
    msg: "User session data",
    data: { user: req.session.user },
  });
});

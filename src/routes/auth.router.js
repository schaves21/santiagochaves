import express from "express";
import passport from "passport";

export const authRouter = express.Router();

authRouter.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/faillogin",
  }),
  async (req, res) => {
    if (!req.user) {
      return res.json({ error: "invalid credentials" });
    }
    req.session.user = {
      _id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      age: req.user.age,
      isAdmin: req.user.isAdmin,
    };
    return res.redirect("/products");
  }
);

authRouter.get("/faillogin", async (req, res) => {
  return res.json({ error: "fail to login" });
});

authRouter.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/failregister",
  }),
  (req, res) => {
    if (!req.user) {
      return res.json({ error: "something went wrong" });
    }
    req.session.user = {
      _id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      age: req.user.age,
      isAdmin: req.user.isAdmin,
    };
    return res.redirect("/profile");
  }
);

authRouter.get("/failregister", async (req, res) => {
  return res.json({ error: "fail to register" });
});

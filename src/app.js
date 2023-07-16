import { __dirname } from "./config.js";
import { cartsRouter } from "./routes/carts.router.js";
import { chatsRouter } from "./routes/chats.router.js";
import { connectMongo } from "./utils/dbConnection.js";
import { connectWebSockets } from "./utils/websockets.js";
import { productsRouter } from "./routes/products.router.js";
import { viewsRouter } from "./routes/views.router.js";
import { authRouter } from "./routes/auth.router.js";
import { usersRouter } from "./routes/users.router.js";
import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import { iniPassport } from "./config/passport.config.js";

const app = express();
const PORT = 8080;

const httpServer = app.listen(PORT, () => {
  console.log(`App runing on ${__dirname} - server http://localhost:${PORT}`);
});

connectWebSockets(httpServer);

connectMongo();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(
  session({
    secret: "asd3ñc30kasod",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://schaves:SNEm7PTJfvLHDy4g@ecommerce.i4y5xac.mongodb.net/ecommerce?retryWrites=true&w=majority",
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 99999,
    }),
  })
);

// CONFIG DE PASSPORT
iniPassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", authRouter);
app.use("/api/users", usersRouter);

app.get(
  "/api/sessions/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
app.get(
  "/api/sessions/githubcallback",
  passport.authenticate("github", { failureRedirect: "/error" }),
  (req, res) => {
    req.session.user = {
      _id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      age: req.user.age,
      rol: req.user.rol,
    };
    res.redirect("/products");
  }
);

app.use("/", viewsRouter);
app.use("/chat", chatsRouter);
app.get("/error-auth", (req, res) => {
  return res.status(400).render("error");
});

app.get("*", (_, res) => {
  return res
    .status(404)
    .json({ status: "error", msg: "that route is not found", data: {} });
});

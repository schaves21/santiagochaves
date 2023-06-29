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

const app = express();
const PORT = 8080;

connectMongo();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://schaves:SNEm7PTJfvLHDy4g@ecommerce.i4y5xac.mongodb.net/ecommerce?retryWrites=true&w=majority",
      ttl: 15 * 60,
    }),
    secret: "asd3ñc30kasod",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 15 * 60 * 1000,
    },
  })
);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

const httpServer = app.listen(PORT, () => {
  console.log(`App runing on ${__dirname} - server http://localhost:${PORT}`);
});

connectWebSockets(httpServer);

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", authRouter);
app.use("/api/users", usersRouter);
app.use("/", viewsRouter);
app.use("/chat", chatsRouter);

app.get("*", (_, res) => {
  return res
    .status(404)
    .json({ status: "error", msg: "that route is not found", data: {} });
});


import express from "express";
import handlebars from "express-handlebars";
import { __dirname } from "./utils.js";
import configureWebSockets from './websockets.js'
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import { viewsRouter} from "./routes/views.router.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended : true }));

app.use(express.static(__dirname + "/public"));

//CONFIG DEL MOTOR DE PLANTILLAS
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// ENDPOINTS API REST
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// LLAMA A LA VISTA VIEWSROUTER PARA MOSTRAR LOS PRODUCTOS EN HTML POR HTTP
app.use("/", viewsRouter);

const httpserver = app.listen(PORT , (req, res) => {

  console.log(`App runing on ${__dirname} - server http://localhost:${PORT}`);

});

configureWebSockets(httpserver);

//OTROS ENDPOINTS
app.get("*", (req, res) => {

  return res
  .status(404)
  .json({ status: "error", msg: "that route is not found", data: {} });
    
});



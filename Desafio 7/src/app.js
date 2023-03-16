import express from "express";
import cookieParser from "cookie-parser";
import { engine } from "express-handlebars";
import session from "express-session";
import MongoStore from "connect-mongo";

import * as dotenv from "dotenv";
import passport from "passport";

import initializePassport from "./config/passport.config.js";
import viewsRouter from "./routes/views.routes.js";
import registroRouter from "./routes/registro.routes.js";
import loginRouter from "./routes/login.routes.js";
import productsRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import githubRoutes from "./routes/github.routes.js";
import conexionDB from "./database/db.mongoose.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");
app.use(express.static("public"));

const PORT = 8080;
const USER_MONGO = process.env.USER_MONGO;
const PASSWORD_MONGO = process.env.PASSWORD_MONGO;
const DB_MONGO = process.env.DB_MONGO;
const DB_URL = `mongodb+srv://${process.env.USER_MONGO}:${process.env.PASS_MONGO}@ecommercecluster.znfvobx.mongodb.net/${process.env.DB_MONGO}?retryWrites=true&w=majority`;

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

server.on("error", (error) => {
  console.log("Error en el servidor", error);
});

app.use(cookieParser());

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: DB_URL,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 10000,
    }),
    secret: "codigo-s3cr3t0",
    resave: true,
    saveUninitialized: true,
  })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

conexionDB();

app.use("/api/home", viewsRouter);
app.use("/api/registro", registroRouter);
app.use("/api/login", loginRouter);
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/sessions", githubRoutes);

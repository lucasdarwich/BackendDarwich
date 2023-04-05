import express from "express";
import cookieParser from "cookie-parser";
import { engine } from "express-handlebars";
import session from "express-session";
import MongoStore from "connect-mongo";
import { Server } from "socket.io";
import axios from "axios";
import nodemailer from "nodemailer";

import * as dotenv from "dotenv";
import passport from "passport";

import initializePassport from "./auth/passport.auth.js";
import viewsRouter from "./routes/views.routes.js";
import registroRouter from "./routes/registro.routes.js";
import loginRouter from "./routes/login.routes.js";
import productsRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import githubRoutes from "./routes/github.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import conexionDB from "./database/db.mongoose.js";
import mockingRoutes from "./routes/mocking.routes.js";

dotenv.config();
const app = express();
const PORT = 8080;
const DB_URL = `mongodb+srv://${process.env.USER_MONGO}:${process.env.PASS_MONGO}@ecommercecluster.znfvobx.mongodb.net/${process.env.DB_MONGO}?retryWrites=true&w=majority`;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");
app.use(express.static("public"));

const server = app.listen(PORT, () => {
  console.log(`Servidor OK en puerto ${PORT}`);
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
    secret: "xxxxxx",
    resave: true,
    saveUninitialized: true,
  })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

conexionDB();

const socketIo = new Server(server);

socketIo.on("connection", (socket) => {
  console.log("Nuevo Usuario conectado");

  socket.on("mensaje", (data) => {
    socketIo.emit("mensajeServidor", data);
    axios.post("http://localhost:8080/api/chat", data);
  });

  socket.on("escribiendo", (data) => {
    socket.broadcast.emit("escribiendo", data);
  });
});

//NodeMailer, falto implementar la ruta, la view y el front, pero funciona.

app.get("/api/mail", async (req, res) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: `${process.env.GMAIL_USER}`,
      pass: `${process.env.GMAIL_PASS}`,
    },
  });
  let result = await transporter.sendMail({
    from: "Lucas Coder Test <lucasdarwich@gmail.com>",
    to: "lucasdarwich@gmail.com", // cambiar por mail de destino
    subject: "Prueba de envio de mail",
    text: "Hola, esto es una prueba de envio de mail",
  });
  res.send(result);
  console.log(result);
});

app.use("/api/home", viewsRouter);
app.use("/api/registro", registroRouter);
app.use("/api/login", loginRouter);
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/sessions", githubRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/mockingproducts", mockingRoutes);

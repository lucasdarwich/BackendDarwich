import express from "express";
import { engine } from "express-handlebars";
import mongoose from "mongoose";
import { Server } from "socket.io";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import chatRouter from "./routes/chat.routes.js";

import * as dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const app = express();
const PORT = 8080;
const mongoUrl = `mongodb+srv://${process.env.USER_MONGO}:${process.env.PASS_MONGO}@ecommercecluster.znfvobx.mongodb.net/${process.env.DB_MONGO}?retryWrites=true&w=majority`;

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");
app.use(express.static("public"));

const server = app.listen(PORT, () => {
  console.log(`Server OK en puerto ${PORT}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.set("strictQuery", false);
mongoose.connect(mongoUrl, (err) => {
  if (err) {
    console.log("Fallo de conexión DB ", err.message);
    process.exit();
  } else {
    console.log("Conectado a la BD");
  }
});

const socketIo = new Server(server);

socketIo.on("connection", (socket) => {
  console.log("Nuevo Usuario conectado");

  socket.on("mensaje", (data) => {
    socketIo.emit("mensajeServidor", data);
    axios.post("http://localhost:8080/chat", data);
  });

  socket.on("escribiendo", (data) => {
    socket.broadcast.emit("escribiendo", data);
  });
});

app.use("/", productRouter);
app.use("/", cartRouter);
app.use("/chat", chatRouter);

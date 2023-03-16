import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const USER_MONGO = process.env.USER_MONGO;
const PASSWORD_MONGO = process.env.PASSWORD_MONGO;
const DB_MONGO = process.env.DB_MONGO;
const DB_URL = `mongodb+srv://${process.env.USER_MONGO}:${process.env.PASS_MONGO}@ecommercecluster.znfvobx.mongodb.net/${process.env.DB_MONGO}?retryWrites=true&w=majority`;

const conexionDB = () => {
  mongoose.set("strictQuery", false);
  mongoose.connect(DB_URL, (err) => {
    if (err) {
      console.log("No se puede conectar a la base de datos");
    } else {
      console.log("Mongoose conectado con Exito");
    }
  });
};

export default conexionDB;

import mongoose from "mongoose";
import { cartModel } from "./cart.model.js";

const registroCollection = "Registro";

const registroSchema = mongoose.Schema({
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    unique: true,
    require: true,
  },
  age: Number,
  password: {
    type: String,
    require: true,
  },
  rol: {
    type: String,
    default: "user",
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cart",
  },
});

registroSchema.pre("save", async function (next) {
  // Si el usuario ya tiene un carrito, no hacemos nada
  if (this.cart) {
    return next();
  }
  try {
    // Crear un nuevo carrito
    const cart = new cartModel({ user: this._id });
    // Guardar el carrito en la base de datos
    await cart.save();
    // Asignar el ID del carrito al usuario
    this.cart = cart._id;
    next();
  } catch (error) {
    next(error);
  }
});

const registroModel = mongoose.model(registroCollection, registroSchema);

export default registroModel;

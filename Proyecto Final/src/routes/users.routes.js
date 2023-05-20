import { Router } from "express";
import UserManager from "../dao/Mongo/users.repository.mongo.js";
import {
  getAllUsers,
  addUser,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsersMainData,
  deleteInactiveUsers,
} from "../controllers/user.controller.js";
const router = Router();

// Crear un usuario
router.post("/", addUser);

// Obtener todos los usuarios
router.get("/", getAllUsers);

// Obtener todos los usuarios con datos principales
router.get("/datosprincipales", getAllUsersMainData);

// Eliminar usuarios inactivos
router.delete("/inactive-users", deleteInactiveUsers);

// Obtener un usuario por ID
router.get("/:id", getUserById);

// Actualizar un usuario por ID
router.put("/:id", updateUser);

// Eliminar un usuario por ID
router.delete("/:id", deleteUser);

export default router;

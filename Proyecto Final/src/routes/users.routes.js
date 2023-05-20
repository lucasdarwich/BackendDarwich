import { Router } from "express";
import UserManager from "../dao/Mongo/users.repository.mongo.js";
import {
  getAllUsers,
  addUser,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsersMainData,
} from "../controllers/user.controller.js";
const router = Router();

// Crear un usuario
router.post("/", addUser);

// Obtener todos los usuarios
router.get("/", getAllUsers);

// Obtener todos los usuarios con datos principales
router.get("/datosprincipales", getAllUsersMainData);

// Obtener un usuario por ID
router.get("/:id", getUserById);

// Actualizar un usuario por ID
router.put("/:id", updateUser);

// Eliminar un usuario por ID
router.delete("/:id", deleteUser);

// Eliminar usuarios inactivos
router.delete("/inactive-users", async (req, res) => {
  try {
    const result = await UserManager.deleteInactiveUsers();
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

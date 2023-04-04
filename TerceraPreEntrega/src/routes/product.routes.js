import { Router } from "express";
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  obtenerProducto,
  obtenerTodosLosProductos,
} from "../controllers/productos.controller.js";

const router = Router();

router.get("/", obtenerProducto);

router.get("/all", obtenerTodosLosProductos);

router.post("/", crearProducto);

router.put("/:id", actualizarProducto);

router.delete("/:id", eliminarProducto);

export default router;

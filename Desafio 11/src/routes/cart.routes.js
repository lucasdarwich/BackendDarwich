import { Router } from "express";
import {
  actualizarProductoCarrito,
  crearCarrito,
  createTicket,
  eliminarProductoCarrito,
  eliminarTodosProductosCarrito,
  obtenerCarrito,
  obtenerCarritoUser,
} from "../controllers/cart.controller.js";
import { isUsuarioRole, checkRoles } from "../middlewares/auth.roles.js";

const router = Router();

router.get("/", obtenerCarrito);

router.get("/:id", obtenerCarritoUser);

router.post("/", crearCarrito);

router.put(
  "/:cid/products/:pid",
  actualizarProductoCarrito,
  checkRoles(["user"])
);

router.delete("/:cid/products/:pid", eliminarProductoCarrito);

router.delete("/:cid", eliminarTodosProductosCarrito);

router.post("/:uid/purchase", createTicket);

export default router;

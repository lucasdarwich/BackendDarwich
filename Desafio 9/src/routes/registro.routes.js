import { Router } from "express";
import passport from "passport";
import {
  autentificarRegistro,
  falloRegistro,
} from "../controllers/registro.controller.js";

const router = Router();

router.get("/", (req, res) => {
  res.render("registro", {});
});

router.post(
  "/",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  autentificarRegistro
);

router.get("/failregister", falloRegistro);

export default router;

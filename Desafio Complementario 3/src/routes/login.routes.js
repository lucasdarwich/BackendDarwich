import { Router } from "express";
import passport from "passport";
import {
  autentificarLogin,
  auth,
  authUser,
  falloLogin,
  logout,
  logueo,
} from "../controllers/login.controller.js";

const router = Router();

router.get("/", (req, res) => {
  res.render("login", {});
});

router.post(
  "/user",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  autentificarLogin
);

router.get("/faillogin", falloLogin);

router.get("/products", auth, logueo);

router.get("/user", auth, authUser);

router.get("/logout", logout);

export default router;

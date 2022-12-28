import { Router } from "express";
import CartManager from "../cartManager.js";
import ProductManager from "../productManager.js";
import path from "path";
const router = Router();
import express from "express";

router.use(express.static("public"));
const cartManager = new CartManager(
  path.resolve(process.cwd(), "public", "carts.json")
);
router.use(express.static("public"));
const productManager = new ProductManager(
  path.resolve(process.cwd(), "public", "products.json")
);
const carts = await cartManager.getCarts();
const products = await productManager.getProducts();

router.post("/", (req, res) => {
  const cart = {};
  let products = [];
  const maxId = carts.reduce((max, cart) => (cart.id > max ? cart.id : max), 0);
  cart.id = maxId + 1;
  cart.products = products;
  carts.push(cart);
  cartManager.creatCart(cart);
  res.send({
    status: "ok",
    message: "carrito agregado",
  });
});

router.get("/:id", (req, res) => {
  const cart = carts.find((u) => u.id === parseInt(req.params.id));
  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ error: "cart no encontrado" });
  }
});

router.post("/:cid/product/:pid", (req, res) => {
  const cart = carts.find((u) => u.id === parseInt(req.params.cid));
  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ error: "cart no encontrado" });
  }
  var product = products.find(function (u) {
    return u.id === parseInt(req.params.pid);
  });

  let quantity = 1;

  cartManager.creatProduct(req.params.cid, product, quantity);
});

export default router;

import { Router } from "express";
import ProductManager from "../productManager.js";
import path from "path";
const router = Router();
import express from "express";

router.use(express.static("public"));
const productManager = new ProductManager(
  path.resolve(process.cwd(), "public", "products.json")
);
const products = await productManager.getProducts();

router.get("/", (req, res) => {
  if (req.query.limit) {
    res.json(products.slice(req.query.start || 0, req.query.limit));
  } else {
    res.json(products);
  }
});

router.get("/:id", (req, res) => {
  const product = products.find((u) => u.id === parseInt(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "producto no encontrado" });
  }
});

router.post("/", (req, res) => {
  const product = req.body;
  const maxId = products.reduce(
    (max, product) => (product.id > max ? product.id : max),
    0
  );
  product.id = maxId + 1;
  products.push(product);
  productManager.addProduct(product);
  res.send({
    status: "ok",
    message: "Producto agregada",
  });
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const product = products.find((product) => product.id === parseInt(id));
  if (!product) {
    res.status(404).send("Producto no encontrado");
  }
  const newProduct = req.body;
  product.title = newProduct.title;
  product.description = newProduct.description;
  product.price = newProduct.price;
  product.thumbnail = newProduct.thumbnail;
  product.code = newProduct.code;
  product.stock = newProduct.stock;

  const index = products.indexOf((product) => (product.id = parseInt(id)));
  products[index] = product;
  productManagr.updateProduct(id, product);
  console.log(ied);
  console.log(index);
  console.log(product);

  res.send({
    status: "ok",
    message: "Producto actualizado",
  });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const product = products.find((product) => product.id === parseInt(id));
  if (!product) {
    res.status(404).send("Producto no encontrado");
  }
  const index = products.indexOf(product);
  productManager.deleteProduct(products[index]);

  res.send({
    status: "ok",
    message: "Producto eliminado",
  });
});

export default router;

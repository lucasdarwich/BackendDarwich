class ProductManager {
  constructor() {
    this.products = [];
  }

  getProducts() {
    return this.products;
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    const producto = {
      id: this.products.length + 1,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    if (
      title === undefined ||
      description === undefined ||
      price === undefined ||
      thumbnail === undefined ||
      code === undefined ||
      stock === undefined
    ) {
      return console.log("Todos los campos son obligatorios");
    }

    let condition = this.products.find((producto) => producto.code === code);
    if (condition) {
      return console.log("El producto ya existe");
    } else {
      this.products.push(producto);
    }
  }

  getProductById(id) {
    let myID = parseInt(id);
    let miPRoducto = null;
    this.products.forEach((producto) => {
      if (producto.id === myID) {
        miPRoducto = producto;
      }
    });
    if (miPRoducto === null) {
      return console.log("No existe el producto");
    } else {
      return miPRoducto;
    }
  }
}

const productManager = new ProductManager();

console.log(productManager.getProducts());

productManager.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  "abc123",
  25
);

console.log(productManager.getProducts());

productManager.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  "abc123",
  25
);

productManager.addProduct("producto prueba", 200, "Sin imagen", "abc123", 25);

console.log(productManager.getProductById(1));
console.log(productManager.getProductById(2));

import fs from "fs";

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async creatCart(cart) {
    try {
      const data = await this.readFile();
      if (data) {
        this.carts = JSON.parse(data);
      }
      cart.id = this.carts.length
        ? this.carts.reduce((max, cart) => (cart.id > max ? cart.id : max), 0) +
          1
        : 1;
      this.carts.push(cart);

      await this.writeFile(this.carts);
    } catch (err) {
      throw err;
    }
  }

  async creatProduct(cartId, product, quantity) {
    var cart = this.carts.find(function (cart) {
      return cart.id === parseInt(cartId);
    });

    var productoExistente = cart.products.find(function (producto) {
      return (producto.id = product.id);
    });

    if (productoExistente) {
      productoExistente.quantity++;
    } else {
      cart.products.push({
        id: product.id,
        quantity: quantity,
      });
    }
    await this.writeFile(this.carts);
  }

  async getCartById(id) {
    try {
      const data = await this.readFile();
      this.carts = JSON.parse(data);
      const cart = this.carts.find((cart) => cart.id === id);
      return cart;
    } catch (err) {
      throw err;
    }
  }

  async getCarts() {
    try {
      const data = await this.readFile();
      this.carts = JSON.parse(data);
      return this.carts;
    } catch (err) {
      throw err;
    }
  }

  async readFile() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.path, "utf-8", (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  async writeFile(data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.path, JSON.stringify(data, null, "\t"), (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }
}

export default CartManager;

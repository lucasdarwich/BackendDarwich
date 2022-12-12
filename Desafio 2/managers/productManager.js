const fs = require("fs/promises");
const { existsSync } = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async readFile() {
    return await fs.readFile(this.path, "utf-8");
  }

  async writeFile(string) {
    return await fs.writeFile(this.path, string, "utf-8");
  }

  async getProducts() {
    try {
      if (existsSync(this.path)) {
        const productsString = await this.readFile();
        const products = await JSON.parse(productsString);
        return products;
      } else {
        return [];
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async getProductsById(id) {
    try {
      const products = await this.getProducts();
      const foundProduct = products.find((elem) => elem.id === id);

      if (!foundProduct) {
        throw new Error("Este producto no existe");
      }

      return foundProduct;
    } catch (error) {
      console.log(error.message);
    }
  }

  async updateProduct(id, newProperties) {
    const products = await this.getProducts();
    const foundProduct = await this.getProductsById(id);

    const productUpdated = { ...foundProduct, ...newProperties };

    const updatedList = products.map((elem) => {
      if (elem.id === productUpdated.id) {
        return productUpdated;
      } else {
        return elem;
      }
    });

    const stringList = await JSON.stringify(updatedList, null, "\t");

    await this.writeFile(stringList);
    return stringList;
  }

  async createProduct(product) {
    try {
      const productsArray = await this.getProducts();
      const newProduct = { id: productsArray.length + 1, ...product };
      productsArray.push(newProduct);

      const productsString = JSON.stringify(productsArray, null, "\t");

      await this.writeFile(productsString);
      console.log("Producto agregado con éxito!");
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProductById(id) {
    try {
      const products = await this.getProducts();
      const productID = await this.getProductsById(id);
      const filteredList = products.filter((product) => product.id !== id);
      if (!productID) {
        throw new Error("ID incorrecto");
      } else {
        const productListString = JSON.stringify(filteredList, null, "\t");
        await fs.writeFile(this.path, productListString);
        console.log(`Producto ID: ${productID.id} eliminado`);
      }
    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = ProductManager;

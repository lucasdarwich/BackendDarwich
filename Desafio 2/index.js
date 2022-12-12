const ProductManager = require("./managers/productManager");
const manager = new ProductManager("./data/Products.json");

const queries = async () => {
  try {
    console.log("Primera consulta!");
    let products = await manager.getProducts();
    console.log(products);

    console.log("Nuevo producto");
    const productDemo = {
      title: "producto prueba",
      description: "Este es un producto prueba",
      price: 200,
      thumbnail: "Sin imagen",
      code: "abc123",
      stock: 25,
    };
    await manager.createProduct(productDemo);

    console.log("Segunda consulta");
    products = await manager.getProducts();
    console.log(products);

    console.log("Busqueda de Producto por ID");
    const productoID = 1;
    bucarProduct = await manager.getProductsById(productoID);
    console.log(bucarProduct);

    console.log("Actualizar producto");
    const list = await manager.updateProduct(1, { stock: 24 });
    console.log(list);
    console.log("Producto actualizado con éxito!");

    console.log("Eliminar producto");
    const eliminarProducto = await manager.deleteProductById(4);
    console.log(eliminarProducto);
  } catch (error) {
    console.log(error);
  }
};

queries();

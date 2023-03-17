//----------------------------------------- REGISTRO ------------------------------------------------------
const elementExists = (id) => document.getElementById(id) !== null;

elementExists("signup") &&
  document.getElementById("signup").addEventListener("click", function () {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const age = document.getElementById("age").value;

    const data = { firstName, lastName, email, password, age };

    fetch("/api/registro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((data) => {
      const result = data.json();
      console.log(result);
      if (data.status === 200) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Usuario Creado Con éxito!",
          showConfirmButton: false,
          timer: 2000,
        });
        setTimeout(function () {
          window.location.href = "/api/login";
        }, 2000);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "El correo ya existe!",
        });
      }
    });
  });

// -------------------------------------------LOGIN ----------------------------------------------------

const handleLogin = async (email, password) => {
  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  };
  try {
    const response = await fetch(`/api/login/user`, config);
    const data = await response.json();
    userId = data.user.id;

    return data.message;
  } catch (error) {
    console.log(error);
  }
};

elementExists("send") &&
  document.getElementById("send").addEventListener("click", function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    handleLogin(email, password).then((data) => {
      if (data === "success") {
        window.location.href = "/api/login/products";
      } else {
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          text: "Usuario o contraseña incorrecta!",
        });
      }
    });
  });

elementExists("logout") &&
  document
    .getElementById("logout")
    .addEventListener("click", async function () {
      try {
        const response = await fetch("/api/login/logout");
        const data = await response.json();
        console.log(data);
        if (data.message === "LogoutOK") {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Gracias por tu visita!",
            showConfirmButton: false,
            timer: 2000,
          });
          setTimeout(function () {
            window.location.href = "/api/home";
          }, 2500);
        } else {
          alert("logout failed");
        }
      } catch (error) {
        console.log(error);
      }
    });

// -----------------------PRODUCTOS------------------------------------------------------

let containerCards = document.getElementById("containerCards");
let containerCart = document.getElementById("containerCart");
let btnAnterior = document.getElementById("btnAnterior");
let btnSiguiente = document.getElementById("btnSiguiente");
let linkCarrito = document.getElementById("linkCarrito");
let tituloCarrito = document.getElementById("tituloCarrito");
let pag = document.getElementById("pag");
let pagina = 1;
let limite;

const paginaProductos = () => {
  const getProduct = async (limit = 4, page = 1) => {
    const product = await fetch(`/api/products/?limit=${limit}&page=${page}`);
    const result = await product.json();
    return result;
  };

  const renderProducts = async () => {
    const products = await getProduct();

    if (!products.products.hasPrevPage) {
      btnAnterior.disabled = true;
    }
    if (products.products.hasNextPage) {
      btnSiguiente.disabled = false;
    }
    if (!products.products.hasNextPage) {
      btnSiguiente.disabled = true;
    }
    if (products.products.hasPrevPage) {
      btnAnterior.disabled = false;
    }

    render(products);
  };

  renderProducts();

  const render = (products) => {
    containerCards.innerHTML = "";
    products.products.docs.map((prod, index) => {
      const item = document.createElement("div");
      item.classList.add("item");
      item.innerHTML = `<div class="card" style="width: 15rem; margin: 5px">
                <div class="card-body">
                <h5 class="card-title">${prod.title}</h5>
                <p class="card-text"> ${prod.description}</p>
                <p class="card-text">Precio: $${prod.price}</p>
                <p class="card-text">Categoría: ${prod.category}</p>
                <p class="card-text">Código: ${prod.code}</p>
                <label for="cantidad">Cantidad:</label>
                <input type=number class="card-text" min="1" value="1" id="${index}"/>
                </div>
                <button class="btn btn-primary mx-auto mb-1" id=${prod._id}>Agregar al Carrito</button>
                </div>`;

      containerCards.appendChild(item);
      const cantidad = document.getElementById(index);
      cantidad.addEventListener("change", (e) => {
        recibirCantidad(e.target.value);
      });

      let quantity;
      const recibirCantidad = (cant) => {
        quantity = cant;
      };
      const btnAgregar = document.getElementById(prod._id);
      btnAgregar.addEventListener("click", () => addCart(prod._id, quantity));
    });
  };

  const siguiente = async () => {
    pagina++;
    pag.innerHTML = pagina;
    const products = await getProduct(4, pagina);
    console.log(products);
    if (!products.products.hasNextPage) {
      btnSiguiente.disabled = true;
    }
    if (products.products.hasPrevPage) {
      btnAnterior.disabled = false;
    }

    render(products);
  };
  const anterior = async () => {
    pagina--;
    pag.innerHTML = pagina;
    const products = await getProduct(4, pagina);

    if (!products.products.hasPrevPage) {
      btnAnterior.disabled = true;
    }
    if (products.products.hasNextPage) {
      btnSiguiente.disabled = false;
    }

    render(products);
  };

  btnSiguiente.addEventListener("click", siguiente);
  btnAnterior.addEventListener("click", anterior);
};
elementExists("pag") && paginaProductos();
// if (window.location.href == 'http://localhost:8080/api/home/products'){
//     console.log('holaaaaa')
//     paginaProductos()
// }

//---------------------------------- CARRITO -------------------------------------------------------

const getUser = async () => {
  const user = await fetch(`/api/login/user`);
  const data = await user.json();
  return data;
};

const getCart = async () => {
  const user = await getUser();
  const userId = user.user._id;
  const getCartUser = await fetch(`/api/carts/${userId}`);
  const data = await getCartUser.json();
  return data;
};

const addCart = async (pid, quantity) => {
  console.log(quantity);
  const carritoUser = await getUser();
  const cartId = carritoUser.user.cart;

  try {
    const addCartProduct = await fetch(`/api/carts/${cartId}/products/${pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quantity: quantity,
      }),
    });
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Producto Agregado al Carrito",
      showConfirmButton: false,
      timer: 2000,
    });
  } catch (err) {
    console.log(err);
  }
};

const deleteCart = async (pid) => {
  const carritoUser = await getUser();
  const cartId = carritoUser.user.cart;
  try {
    const deleteCartProduct = await fetch(
      `/api/carts/${cartId}/products/${pid}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Producto eliminado del carrito",
      showConfirmButton: false,
      timer: 2000,
    });
    renderCart();
  } catch (err) {
    console.log(err);
  }
};

// const renderCart = async () => {

//     const productos = await getCart()
//     console.log(productos)
//     const list = await productos[0].products.map((prod) => {
//         return `<div class="card" style="width: 15rem; margin: 5px">
//                     <div class="card-body">
//                         <h5 class="card-title">${prod.product.title}</h5>
//                         <p class="card-text"> ${prod.product.description}</p>
//                         <p class="card-text">PRECIO: $${prod.product.price}</p>
//                         <p class="card-text">Cantidad: ${prod.quantity}</p>
//                         <button class="btn btn-danger mx-auto mb-1" id=${prod.product._id}>Eliminar del Carrito</button>
//                      </div>
//                  </div>`
//         const btnEliminar = document.getElementById(prod.product._id)
//     })
//         .join(' ')
//     containerCart.innerHTML = list

// }

const renderCart = async () => {
  const productos = await getCart();
  containerCart.innerHTML = "";
  await productos[0].products.map((prod, index) => {
    const item = document.createElement("div");
    item.classList.add("item");
    item.innerHTML = `<div class="card" style="width: 15rem; margin: 5px">
        <div class="card-body">
            <h5 class="card-title">${prod.product.title}</h5>
            <p class="card-text"> ${prod.product.description}</p>
            <p class="card-text">PRECIO: $${prod.product.price}</p>
            <p class="card-text">Cantidad: ${prod.quantity}</p>
            <button class="btn btn-danger mx-auto mb-1" id=${prod.product._id}>Eliminar del Carrito</button>
         </div>
     </div>`;

    containerCart.appendChild(item);

    const btnEliminar = document.getElementById(prod.product._id);
    btnEliminar.addEventListener("click", () => deleteCart(prod.product._id));
  });
};
elementExists("containerCart") && renderCart();

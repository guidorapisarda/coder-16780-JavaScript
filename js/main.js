//variables generales del sistema.
let productos = [];
let compras = []; //listado de compras del sistema.

//busco si existe una compra con ese ID, sino devuelvo null.
const buscarCompra = (idCompra) => {
  for (compra in compras) {
    if (compra.id == idCompra)
      return compra;
  }
  return null;
};

//busco si existe un producto con ese ID, sino devuelvo null.
const buscarProducto = (idProducto) => {
  for (let i = 0; i < productos.length; i++) {
    let prod = productos[i];
    if (prod.id == idProducto) return prod;
  }
};

const filterProd = idProd => prod.id == idProducto;

//creo una compra a partir del carrito recibido.
const crearCompra = (carrito) => {
  let idCompra = compras.length + 1;
  let compraActual = new Compra(idCompra);
  for (i = 0; i < carrito.length; i++) {
    let itemCarrito = carrito[i];
    let productoActual = buscarProducto(itemCarrito.idProducto);
    if (productoActual) {
      compraActual.agregarItem(productoActual, itemCarrito.unidades);
    }
  }
  compras.push(compraActual);
  return compraActual;
};

const getCompras = () => {
  console.log(compras);
};
const getProductos = () => {
  console.log(productos);
};

// funciones generales.
const solicitarNumero = (msg) => {
  let numero;
  do {
    numero = prompt(msg);
    numero = parseInt(numero);
  } while (!numero);
  return numero;
};

//Inicializacion con datos Dummy
crearCompra([{
    idProducto: 3,
    unidades: 2
  },
  {
    idProducto: 5,
    unidades: 1
  },
  {
    idProducto: 6,
    unidades: 20
  },
  {
    idProducto: 2,
    unidades: 6
  },
]);
crearCompra([{
    idProducto: 2,
    unidades: 1
  },
  {
    idProducto: 1,
    unidades: 10
  },
  {
    idProducto: 3,
    unidades: 5
  },
  {
    idProducto: 2,
    unidades: 6
  },
]);
crearCompra([{
    idProducto: 2,
    unidades: 1
  },
  {
    idProducto: 1,
    unidades: 10
  },
  {
    idProducto: 3,
    unidades: 5
  },
  {
    idProducto: 2,
    unidades: 6
  },
]);

//Armado del listado de productos, para mostrarlo en el HTML como Cards.
const mostrarProductos = (producto, i) => {
  let listadoProds = document.getElementById("listadoProds");

  //creo tantas opciones como stock haya.
  let selectOptions = '';
  for (let j = 0; j < producto.stock; j++) {
    selectOptions += `<option value=${j+1}>${j+1}</option>`
  }

  let card = `<div class="card col-4 mx-2 mb-4 pt-4">
                    <img src="${producto.image}" class="card-img-top" alt="fotoRandom${i}">
                    <div class="card-body">
                        <h5 class="card-title" id=${producto.id}>${producto.nombre}</h5>
                        <p class="card-text">${producto.descripcion}</p>
                        <div class="d-flex justify-content-center">
                          <div class="pricing-card">
                            <div>Valor: $</div><div>${producto.valor}</div>
                            <select>
                              ${selectOptions}
                            </select>
                          </div>
                        </div>
                        <button class="btn btn-primary product">Agregar</button>
                    </div>
                </div>`;
  listadoProds.innerHTML += card;

};


//Llamado con AJAX a la API de FakestoreAPI para el armado del catalogo de productos.
$.ajax({
  url: 'https://fakestoreapi.com/products/category/electronics?limit=20',
  method: 'GET',
  dataType: 'JSON',
  success: productsraw => {
    crearProductos(productsraw);
    productos.forEach(mostrarProductos);
    //Agrego la funcion "agregarCarrito" a los botones, para que la ejecuten cuando sean presionados.
    $('.product').click(agregarCarrito);

    //Agrego la funcion renderCart al carrito, para que me muestre lo que tengo agregado.
    $(document).ready(function () {
      //renderizo el carrito ni bien está disponible la página.
      renderCart(obtenerCarrito());

      //muestro u oculto el carrito según se necesite.
      $(".cart").click(function () {
        let cart = $('#cart-content', this);
        if (cart.prop("classList").value == 'hideCart') {
          cart.removeClass('hideCart');
          cart.addClass('showCart');
        } else {
          cart.removeClass('showCart');
          cart.addClass('hideCart');
        }
      });

      $("#vaciar-carrito").click(emptyCart);
      $("#delete-cart-item").click(deleteItem);
    });
  },
  error: jqXHR => {
    console.log(jqXHR);
  }
});

const emptyCart = () => {
  localStorage.setItem('carrito', '');
  renderCart(obtenerCarrito());
}

//Creacion de productos.
const crearProductos = productsraw => {
  for (let item of productsraw) {
    let newProd = new Producto(item.id, item.title, item.description, item.price * 171, random(40, 100), item.image);
    productos.push(newProd);
  }
}

//Funcion de generacion random de numeros para el stock.
const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;


//Defino la funcion "agregarCarrito", que parte del evento "click" y obtiene la informacion sobre la tarjeta en la que fue presionado.
//obtengo el valor y la cantidad del producto seleccionado, y guarda el carrito (si no existe, lo crea) en el localStorage del navegador.
const agregarCarrito = (e) => {
  let idProducto = Number(e.target.parentNode.querySelector('.card-title').getAttribute('id'));
  let unidades = Number(e.target.parentNode.querySelector('select').value);
  let prod = productos.filter( prod => prod.id == idProducto);

  let carrito = obtenerCarrito();

  let index = carrito.productos.findIndex(prod => prod.idProducto == idProducto);

  if (index >-1){
    carrito.productos[index].unidades+=unidades;
  }else{
    let nuevaSeleccion = {
      idProducto: idProducto,
      unidades: unidades,
      img: prod[0].image
    }
    carrito.productos.push(nuevaSeleccion);
  }
  localStorage.setItem('carrito', JSON.stringify(carrito));
  renderCart(carrito);
}

const obtenerCarrito = () => {
  let carrito = localStorage.getItem('carrito');
  if (!carrito)
    carrito = {
      productos: []
    }
  else
    carrito = JSON.parse(carrito);
  return carrito;
}

const deleteItem = (e) => {
  let id = Number(e.target.parentNode.querySelector('.idP').textContent);
  let currentCart = obtenerCarrito();
  for ( let i=0; i<currentCart.productos.length;i++){
    console.log(currentCart.productos)
    if (currentCart.productos[i].idProducto == id){
      currentCart.productos.splice(i,1);
      console.log(currentCart.productos);
    }
  }
  localStorage.setItem('carrito', JSON.stringify(currentCart));
  renderCart(obtenerCarrito());
}

const renderCart = (cart) => {
  let cartItems = cart.productos;
  let html = document.querySelector('#cart-list .items');
  html.textContent = '';
  cartItems.forEach(item => {
    let img = item.img;
    qty = item.unidades;
    item = buscarProducto(item.idProducto);
    let newItem = document.createElement('tr');
    newItem.innerHTML += `<td class="text-center">
                          <img src="${img}" id="img-carrito"></td>
                          <td class="d-none idP">${item.id}</td>
                          <td class="text-center">${item.nombre}</td>
                          <td class="text-center">$${item.valor}</td>
                          <td class="text-center">${qty}</td>
                          <td id="delete-cart-item">X</td>`
    html.appendChild(newItem);
  });
}
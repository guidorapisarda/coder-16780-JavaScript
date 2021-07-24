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
  let productos = carrito.productos;
  for (let i = 0; i < productos.length; i++) {
    let itemCarrito = productos[i];
    let productoActual = buscarProducto(itemCarrito.idProducto);
    if (productoActual) {
      productoActual.removerStock(itemCarrito.unidades);
      compraActual.agregarItem(productoActual, itemCarrito.unidades);

      //Envio al producto correspondiente, el nuevo stock post compra.
      $.ajax(`https://fakestoreapi.com/products/+${itemCarrito.idProducto}`,{
        method:"PATCH",
        body:JSON.stringify(
            {
                stock: productoActual.stock
            }
        ),
        success: function (data, status, xhr) {
          console.log('status: ' + status + ', data: ' + JSON.stringify(data));
        },
        error: jqXHR => {
          console.log(jqXHR);
        }
      });
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
// crearCompra([{
//     idProducto: 3,
//     unidades: 2
//   },
//   {
//     idProducto: 5,
//     unidades: 1
//   },
//   {
//     idProducto: 6,
//     unidades: 20
//   },
//   {
//     idProducto: 2,
//     unidades: 6
//   },
// ]);
// crearCompra([{
//     idProducto: 2,
//     unidades: 1
//   },
//   {
//     idProducto: 1,
//     unidades: 10
//   },
//   {
//     idProducto: 3,
//     unidades: 5
//   },
//   {
//     idProducto: 2,
//     unidades: 6
//   },
// ]);
// crearCompra([{
//     idProducto: 2,
//     unidades: 1
//   },
//   {
//     idProducto: 1,
//     unidades: 10
//   },
//   {
//     idProducto: 3,
//     unidades: 5
//   },
//   {
//     idProducto: 2,
//     unidades: 6
//   },
// ]);

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
      $("#img-carrito").click(function () {
        let cart = $('#cart-content');
        if (cart.prop("classList").value == 'hideCart') {
          cart.removeClass('hideCart');
          cart.addClass('showCart');
        } else {
          cart.removeClass('showCart');
          cart.addClass('hideCart');
        }
      });
      $(document).click(function (e) {
        let cart = $('#cart-content');
        if (!$(e.target).hasClass('cart-content') && cart.hasClass('showCart') && !$(e.target).is('#img-carrito') && !$(e.target).is('#cart-content') && !$(e.target).hasClass('widget') ){
          cart.removeClass('showCart');
          cart.addClass('hideCart');
        }
      });
    });
  },
  error: jqXHR => {
    console.log(jqXHR);
  }
});

const finalizarCompra = () => {
  let cart = obtenerCarrito();
  let compraactual = crearCompra(cart);
  console.log(compraactual);
}

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
  let id = Number(e.target.parentNode.parentNode.querySelector('.idP').textContent);
  let currentCart = obtenerCarrito();
  for ( let i=0; i<currentCart.productos.length;i++){
    if (currentCart.productos[i].idProducto == id){
      currentCart.productos.splice(i,1);
    }
  }
  localStorage.setItem('carrito', JSON.stringify(currentCart));
  renderCart(obtenerCarrito());
}

const renderCart = (cart) => {
  let cartItems = cart.productos;
 
  //si no tengo productos en el carrito
  if (cartItems.length == 0){
    if($('#sinItems').length == 0){
      $('#cart-content').empty();
      $('#cart-content').append(`<div class="widget"><p id="sinItems" class="widget">No hay productos en el carrito!</p></div>`);
    }
  }else{
    //si tengo productos en el carrito y, ademas, la tabla de items no existe
    if( $('.items').length == 0){
      $('#cart-content').empty();
      $('#cart-content').prepend(`
      <table id="cart-list" class="u-full-width widget">
        <thead class="header widget">
          <tr class="widget">
            <th class="text-center widget">Imagen</th>
            <th class="text-center widget">Nombre</th>
            <th class="text-center widget">Precio</th>
            <th class="text-center widget">Cantidad</th>
            <th class="text-center widget"></th>
          </tr>
        </thead>
        <tbody class="items widget"></tbody>
      </table>`);

      $('#cart-content').append(`
      <div class="cartButtons widget">
        <button id="vaciar-carrito" type="button" class="btn btn-primary widget">Vaciar Carrito</button>
        <button id="finalizarCompra" type="button" class="btn btn-primary widget">Finalizar</button>
      </div>`);
      $("#vaciar-carrito").click(emptyCart);
      $("#finalizarCompra").click(finalizarCompra);
    }
    //Comienzo a crear los elementos del carrito.
    let html = $('#cart-list .items');
    html.empty();
    cartItems.forEach(item => {
      let img = item.img;
      qty = item.unidades;
      item = buscarProducto(item.idProducto);
      let newItem = document.createElement('tr');
      newItem.classList.add('widget');
      newItem.innerHTML += `<td class="text-center widget">
                            <img src="${img}" id="img-carrito"></td>
                            <td class="d-none idP widget">${item.id}</td>
                            <td class="text-center widget">${item.nombre}</td>
                            <td class="text-center widget">$${item.valor}</td>
                            <td class="text-center widget">${qty}</td>
                            <td class="widget"><button class="btn btn-dark widget delete-cart-item">Remover</button></td>`;
      html.append(newItem);
    });
    //le agrego a todos los items, la posibilidad de eliminarse a si mismo.
    $(".delete-cart-item").click(deleteItem);
  }
 
}
let cart = [];
let listadoProductos = [];
let compras = []; //listado de compras del sistema.

const finalizarCompra = () => {
    let cart = obtenerCarrito();
    let tmpCompras = getLocal('compras');
    if (!tmpCompras)
        tmpCompras = [];
    compras = tmpCompras;
    let compraactual = crearCompra(cart.productos);

    compras.push(compraactual);
    saveLocal('compras', compras);
    alert(`Muchas gracias por su compra! La misma ha sido registrada con el numero ${compraactual.id}`);
    saveLocal('carrito', '');
    location.href = "../index.html";
}

const emptyCart = () => {
    saveLocal('carrito', '');
    renderCart(obtenerCarrito());
}

//Creacion de productos.
const crearProductos = productsraw => {
    let temp = [];
    for (let item of productsraw) {
        let newProd = new Producto(item.id, item.nombre, item.descripcion, item.valor, item.stock, item.image);
        temp.push(newProd);
    }
    return temp;
}

//Funcion de generacion random de numeros para el stock.
const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;


//Defino la funcion "agregarCarrito", que parte del evento "click" y obtiene la informacion sobre la tarjeta en la que fue presionado.
//obtengo el valor y la cantidad del producto seleccionado, y guarda el carrito (si no existe, lo crea) en el localStorage del navegador.
const agregarCarrito = (e) => {
    let idProducto = Number(e.target.parentNode.querySelector('.card-title').getAttribute('id'));
    let unidades = Number(e.target.parentNode.querySelector('select').value);
    let prod = listadoProductos.filter(prod => prod.id == idProducto);

    let carrito = obtenerCarrito();

    let index = carrito.productos.findIndex(prod => prod.idProducto == idProducto);

    if (index > -1) {
        carrito.productos[index].unidades += unidades;
    } else {
        let nuevaSeleccion = {
            idProducto: idProducto,
            unidades: unidades,
            img: prod[0].image
        }
        carrito.productos.push(nuevaSeleccion);
    }
    saveLocal('carrito', carrito);
    renderCart(carrito);
}

const obtenerCarrito = () => {
    let carrito = getLocal('carrito');
    if (!carrito)
        carrito = {
            productos: []
        }
    return carrito;
}

const deleteItem = (e) => {
    let id = Number(e.target.parentNode.parentNode.querySelector('.idP').textContent);
    let currentCart = obtenerCarrito();
    for (let i = 0; i < currentCart.productos.length; i++) {
        if (currentCart.productos[i].idProducto == id) {
            currentCart.productos.splice(i, 1);
        }
    }
    saveLocal('carrito', currentCart);
    renderCart(obtenerCarrito());
}

const saveLocal = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
}

const getLocal = key => JSON.parse(localStorage.getItem(key));

const renderCart = (cart) => {
    let cartItems = cart.productos;

    //si no tengo productos en el carrito
    if (cartItems.length == 0) {
        if ($('#sinItems').length == 0) {
            $('#cart-content').empty();
            $('#cart-content').append(`<div class="widget"><p id="sinItems" class="widget">No hay productos en el carrito!</p></div>`);
        }
    } else {
        //si tengo productos en el carrito y, ademas, la tabla de items no existe
        if ($('.items').length == 0) {
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
          <a id="finalizarCompra" href="./checkout.html" class="btn btn-primary widget">Checkout</a>
        </div>`);
            $("#vaciar-carrito").click(emptyCart);

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

const renderCartAtCheckout = () => {
    let cartItems = obtenerCarrito().productos;
    let cantidadElementos = 0;
    let totalSinIVA = 0;
    let totalConIVA = 0;
    //cargo los productos en memoria, para luego usarlos.
    cargarProductos();
    cartItems.forEach(prod => {
        cantidadElementos += prod.unidades;
    });
    if (cantidadElementos > 0) {
        cartItems.forEach(cartItem => {
            let prod = buscarProducto(cartItem.idProducto);
            totalSinIVA += (prod.valor * cartItem.unidades);
            totalConIVA += (prod.calcularValorIva() * cartItem.unidades);
            $('#cartItemCount').text(cantidadElementos);
            $('#cartItems').append(`<li class="list-group-item d-flex justify-content-between lh-sm">
            <div><img src="${cartItem.img}" id="img-carrito"></div>
            <div>
            <h6 class="my-0">${prod.nombre}</h6>
            <small class="text-muted">Cantidad: ${cartItem.unidades} - Valor Unitario: $${prod.valor}</small>
            </div>
            <span class="text-muted">$${prod.valor * cartItem.unidades}</span>
            </li>`);
        });
        $('#cartItems').append(`
        <li class="list-group-item d-flex justify-content-between">
            <span>Subtotal (ARS)</span>
            <strong>$${totalSinIVA}</strong>
        </li>
        <li class="list-group-item d-flex justify-content-between">
            <span>Total (ARS)</span>
            <strong>$${totalConIVA}</strong>
        </li>`);
    }
}

const cargarProductos = () => {
    //obtengo el listado de productos del localstorage.
    let values = getLocal('listadoProductos');
    //genero el array en memoria de Objetos de tipo Producto a partir del array obtenido.
    listadoProductos = crearProductos(values);
}

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
    if (listadoProductos.length == 0) {
        cargarProductos();
    }
    for (let i = 0; i < listadoProductos.length; i++) {
        let prod = listadoProductos[i];
        if (prod.id == idProducto) return prod;
    }
};

const filterProd = idProd => prod.id == idProducto;

//creo una compra a partir del carrito recibido.
const crearCompra = cart => {
    let idCompra = compras.length + 1;
    let compraActual = new Compra(idCompra);
    // for (let i = 0; i < listadoProductos.length; i++) {
    //     let itemCarrito = listadoProductos[i];
    //     itemCarrito.removerStock(itemCarrito.unidades);
    //     compraActual.agregarItem(itemCarrito, itemCarrito.unidades);
    // }
    cart.forEach(item => {
        let actual = buscarProducto(item.idProducto);
        actual.removerStock(item.unidades);
        compraActual.agregarItem(actual, item.unidades);
    });

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
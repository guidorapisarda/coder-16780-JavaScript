//variables generales del sistema.
let productos = [
  new Producto(1, "lavarropa", "lavarropa marca patito", 9999.99, 20),
  new Producto(2, "secarropa", "secarropa marca patito", 19999.99, 30),
  new Producto(3, "mouse", "mouse marca patito", 299.99, 25),
  new Producto(4, "mouse", "mouse marca patito", 1299.99, 11),
  new Producto(5, "mouse", "mouse marca patito", 3299.99, 12),
  new Producto(6, "mouse", "mouse marca patito", 2299.99, 3),
]; //listado de productos del sistema.
let compras = []; //listado de compras del sistema.

//busco si existe una compra con ese ID, sino devuelvo null.
const buscarCompra = (idCompra) => {
  for (compra in compras) {
    if (compra.id == idCompra) return compra;
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
crearCompra([
  { idProducto: 3, unidades: 2 },
  { idProducto: 5, unidades: 1 },
  { idProducto: 6, unidades: 20 },
  { idProducto: 2, unidades: 6 },
]);
crearCompra([
  { idProducto: 2, unidades: 1 },
  { idProducto: 1, unidades: 10 },
  { idProducto: 3, unidades: 5 },
  { idProducto: 2, unidades: 6 },
]);
crearCompra([
  { idProducto: 2, unidades: 1 },
  { idProducto: 1, unidades: 10 },
  { idProducto: 3, unidades: 5 },
  { idProducto: 2, unidades: 6 },
]);

//Armado del listado de productos, para mostrarlo en el HTML como Cards.
const mostrarProductos = (producto,i) => {
  let listadoProds = document.getElementById("listadoProds");

  //creo tantas opciones como stock haya.
  let selectOptions='';
  for(let j=0;j<producto.stock;j++){
    selectOptions+=`<option value=${j+1}>${j+1}</option>`
  }

  let card = `<div class="card col-4 mx-2 mb-4 pt-4">
                    <img src="https://source.unsplash.com/random?sig=${i}" class="card-img-top" alt="fotoRandom${i}">
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
productos.forEach(mostrarProductos);

//Defino la funcion "agregarCarrito", que parte del evento "click" y obtiene la informacion sobre la tarjeta en la que fue presionado.
//obtengo el valor y la cantidad del producto seleccionado, y guarda el carrito (si no existe, lo crea) en el localStorage del navegador.
const agregarCarrito = (e) => {
  let idProducto=e.target.parentNode.querySelector('.card-title').getAttribute('id');
  let unidades=e.target.parentNode.querySelector('select').value;
  
  let nuevaSeleccion = {
    idProducto: idProducto,
    unidades: unidades
  }

  let carritoActual = localStorage.getItem('carrito');

  if(!carritoActual){
    carritoActual = {productos:[]}
  }else{
    carritoActual=JSON.parse(carritoActual);
  }
  
  carritoActual.productos.push(nuevaSeleccion);

  localStorage.setItem('carrito',JSON.stringify(carritoActual));
}

//Agrego la funcion "agregarCarrito" a los botones, para que la ejecuten cuando sean presionados.
let botones = document.querySelectorAll('.product');

botones.forEach( boton => {
  boton.addEventListener("click", agregarCarrito);
});
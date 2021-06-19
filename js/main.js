//variables generales del sistema.
let productos = [new Producto(1,'lavarropa','lavarropa marca patito',9999.99, 1000),
                    new Producto(2,'secarropa','secarropa marca patito',19999.99, 1000),
                    new Producto(3,'mouse','mouse marca patito',299.99, 1000),
                    new Producto(4,'mouse','mouse marca patito',1299.99, 1000),
                    new Producto(5,'mouse','mouse marca patito',3299.99, 1000),
                    new Producto(6,'mouse','mouse marca patito',2299.99, 1000)]; //listado de productos del sistema.
let compras = []; //listado de compras del sistema.

//Funciones

//busco si existe una compra con ese ID, sino devuelvo null.
const buscarCompra = (idCompra) => {
    for (compra in compras){
        if(compra.id == idCompra)
            return compra;
    }
    return null;
}

//busco si existe un producto con ese ID, sino devuelvo null.
const buscarProducto = (idProducto) => {
    for (let i=0; i<productos.length;i++){
        let prod = productos[i];
        if(prod.id == idProducto)
            return prod;
    }
}

//creo una compra a partir del carrito recibido.
const crearCompra = (carrito) => {
    let idCompra = compras.length+1;
    let compraActual = new Compra(idCompra);
    for (i=0; i < carrito.length; i++){
        let itemCarrito = carrito[i];
        let productoActual = buscarProducto (itemCarrito.idProducto);
        if (productoActual){
            compraActual.agregarItem(productoActual,itemCarrito.unidades);
        }
    }
    compras.push(compraActual);
    return compraActual;
}

const getCompras = () => {
    console.log(compras);
}
const getProductos = () => { 
    console.log(productos);
}


// funciones generales.
const solicitarNumero = (msg) => {
    let numero;
    do{
        numero = prompt(msg);
        numero = parseInt(numero);
    }while(!numero);
    return numero;
}

//Inicializacion con datos Dummy

crearCompra([{'idProducto':3,'unidades': 2},{'idProducto':5,'unidades': 1},{'idProducto':6,'unidades': 20},{'idProducto':2,'unidades': 6}]);
crearCompra([{'idProducto':2,'unidades': 1},{'idProducto':1,'unidades': 10},{'idProducto':3,'unidades': 5},{'idProducto':2,'unidades': 6}]);
crearCompra([{'idProducto':2,'unidades': 1},{'idProducto':1,'unidades': 10},{'idProducto':3,'unidades': 5},{'idProducto':2,'unidades': 6}]);

//Ingreso de datos

let cantidadDeProductos = solicitarNumero('Ingrese la cantidad de productos que desea comprar:');
let contador=1;
let carrito=[];

while (contador <= cantidadDeProductos){
    let idProducto = solicitarNumero('Ingrese el id del producto que desea comprar:');
    let unidades = solicitarNumero('Ingrese la cantidad de unidades que desea comprar del producto:');
    carrito.push({idProducto,unidades});
    contador++;
}

let compranueva = crearCompra(carrito);
console.log(`Subtotal de la compra: ${compranueva.calculoSubtotal()}\nIva:${compranueva.calcularIva()}\nTotal:${compranueva.calcularTotal()}`);
getCompras()
//Realizo los calculos
//let resultado = calculoSubtotal(calcularIva(costo),cantidad);

//alert(resultado);
//console.log(resultado);
//Actualizo el campo con el valor del calculo.
//mostrarValor(resultado);
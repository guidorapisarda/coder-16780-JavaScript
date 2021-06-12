const iva = 21;

//Funciones
const calcularIva = value => (value*iva/100)+value;
const calculoSubtotal = (value, qty) => value*qty;
const mostrarValor = value => {
    document.getElementById('output').innerHTML = value;
}

const solicitarNumero = (msg) => {
    let numero;
    do{
        numero = prompt(msg);
        numero = parseInt(numero);
    }while(!numero);
    return numero;
}

//Ingreso de datos

let costo = solicitarNumero('Ingrese un costo del producto al que queira calcularle el iva:');
let cantidad = solicitarNumero('Ingrese cantidad de productos:');

//Realizo los calculos
let resultado = calculoSubtotal(calcularIva(costo),cantidad);

alert(resultado);
console.log(resultado);
//Actualizo el campo con el valor del calculo.
mostrarValor(resultado);
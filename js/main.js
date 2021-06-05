let input = prompt('Ingrese una operacion (suma, resta, multiplicacion, division):');

input = input.toLowerCase();

if ( !(input == 'suma' || input == 'resta' || input == 'multiplicacion' || input == 'division')){
    alert('Operacion no valida!');
}

let value1 = Number(prompt('Ingrese valor:'));
let value2 = Number(prompt('Ingrese valor:'));
alert('La operacion ingresada es: *'+input+'*');
if ( input == 'suma' ){
    alert('Resultado: '+value1+value2);
    console.log(value1+value2);
}else{
    if ( input == 'resta' ){
        alert('Resultado: '+value1-value2);
        console.log(value1-value2);
    }else{
        if ( input == 'multiplicacion' ){
            alert('Resultado: '+value1*value2);
            console.log(value1*value2);
        }else{
            if (value2 == 0)
                alert('No se puede divir por cero.');
            else{
                alert('Resultado: '+value1/value2);
                console.log(value1/value2);
            }
        }
    }
}
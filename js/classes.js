const iva = 21;

class Producto {
    constructor(id,nombre,descripcion,valor,stock){
        this.id=id;
        this.nombre=nombre;
        this.descripcion=descripcion;
        this.valor=valor;
        this.stock=stock;
    }

    //metodo para agregar stock.
    agregarStock = cantidad => {
        stock+=cantidad;
    }

    //metodo para agregar stock.
    removerStock = cantidad => {
        //Checkeo si el stock es suficiente
        if (cantidad > this.stock)
            return ErrorEvent; //buscar si es asi.
        this.stock-=cantidad;
    }
}

class Compra {
    //Comienzo una compra.
    constructor(idCompra){
        this.id = idCompra;
        this.items=[]; //es un vector de elementos.
    }
    //Metodo para agregar items a la compra.
    agregarItem(producto,cantidad){
        let item = new itemCompra(this.items.length+1,producto,cantidad); //le creo un idItem a cada uno, a partir de la cantidad de items del vector "items".
        this.items.push(item);
        console.log(this.items);
    }

    //Metodo para remover items a la compra.
    removerItem(idItem){
        let newitems=[];
        for (let i=0; i < this.items.length;i++){
            let item = this.items[i];
            if(item.id == idItem)
                continue;
            else{
                newitems.add(item);
            }
        }
        this.items=newitems;
    }

    calculoSubtotal = () => {
        let parcial=0;
        for(let i=0; i < this.items.length;i++){
            let item = this.items[i];
            parcial += item.calcularValor();
        }
        return parcial;
    }

    calcularIva = () => {
        let subtotal = this.calculoSubtotal();
        return (subtotal*iva/100);
    }

    calcularTotal = () => {
        let subtotal = this.calculoSubtotal();
        return (subtotal*iva/100)+subtotal;
    }

    mostrarValor = value => {
        document.getElementById('output').innerHTML = value;
    }
}

class itemCompra{
    constructor(id,producto,cantidad){
        this.id=id;
        this.producto = producto; //guardo el objeto "producto" que vendi.
        this.cantidad = cantidad;
    }
    
    calcularValor = () => this.producto.valor * this.cantidad;
}
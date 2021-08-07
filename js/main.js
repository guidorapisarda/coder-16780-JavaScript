//variables generales del sistema.


//Llamado con AJAX a la API de FakestoreAPI para el armado del catalogo de productos.
$.ajax({
  url: 'https://fakestoreapi.com/products/category/electronics?limit=20',
  method: 'GET',
  dataType: 'JSON',
  success: productsraw => {
    productsraw.forEach(elem => {

      elem["price"] = elem.price * 171;
      elem["stock"] = random(40, 100);
      elem["id"] = elem.id;
      elem["nombre"] = elem.title;
      elem["descripcion"] = elem.description;
      elem["valor"] = elem.price;
      elem["stock"] = elem.stock;
      elem["image"] = elem.image;
    });

    //dejo en memoria los productos luego de crearlos.
    listadoProductos = crearProductos(productsraw);
    //Guardo los productos recientemente generados en el localstorage.
    saveLocal('listadoProductos', listadoProductos);
    //Hago el render de los productos.
    listadoProductos.forEach(mostrarProductos);
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
        if (!$(e.target).hasClass('cart-content') && cart.hasClass('showCart') && !$(e.target).is('#img-carrito') && !$(e.target).is('#cart-content') && !$(e.target).hasClass('widget')) {
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
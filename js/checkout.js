$(document).ready(() => {
    renderCartAtCheckout();
    $('#cuit').hide();
    $("#finalizarCompra").click(finalizarCompra);
    $("#checkbox").change(function () {
        if ($(this).is(":checked")) {
            $('#cuit').show();
            $("#cuitinput").prop('required', true);
        } else {
            $('#cuit').hide();
            $("#cuitinput").prop('required', false);
        }
    });

    $.ajax({
        url: 'https://apis.datos.gob.ar/georef/api/provincias',
        dataType: "json",
        success: states => {
            let provincias = states.provincias.sort((a, b) => a.id - b.id);
            provincias.forEach(provincia => {
                $('#state').append(`<option>${provincia.nombre}</option>`);
            });
        },
        error: jqXHR => {
            console.log(jqXHR);
        }
    });
});
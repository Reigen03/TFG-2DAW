/* Cuando se haga click al botón de iniciar sesión, se cogerán los datos de los input y se enviarán a una función
que hará una petición al backend para iniciar sesión. */
$(document).ready(function() {
    $("#btnLogin").on("click", function() {
        let mail = $("#mailLogin").val();
        let pass = $("#passLogin").val();

        if (mail == "" || pass == "") {
            iziToast.warning({
                title: "¡Mucho vacío!",
                message: "Introduce tus credenciales",
            });
        } else {
            iniciarSesion(mail, pass);
        }
    });
});

// Esta función hará una petición para que el backend compruebe si el usuario existe, e inicie sesión si se da el caso.
function iniciarSesion(mail, pass) {
    var conexion = $.ajax({
        url: `/login/${mail}/${pass}`,
        type: "POST",
        dataType: "text"
    });
        
    conexion.done(function(respuesta) {
        if (respuesta == "correcto") {
            iziToast.success({
                title: "¡Bienvenido!",
                message: "Sesión iniciada",
            });

            document.addEventListener('iziToast-closed', function(){
                window.location.href = "/";
            });
        } else if (respuesta == "incorrecto") {
            iziToast.error({
                title: "Error",
                message: "Ese usuario no existe...",
            });
        } else {
            iziToast.error({
                title: "Error.",
                message: "Ha ocurrido un error inesperado...",
            });
        }

    });
        
    conexion.fail(function(jqXHR, textStatus, errorThrown) {
        console.log("Error de solicitud: " + textStatus + errorThrown);
    });
}
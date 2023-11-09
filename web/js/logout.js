// Esta función realiza una petición al backend para cerrar la sesión.
$(document).ready(function() {
    $("#cerrarSesion").on("click", function() {
        var conexion = $.ajax({
            url: "/logout",
            type: "GET",
            dataType: "text"
        });
            
        conexion.done(function(respuesta) {
            if (respuesta == "correcto") {
                iziToast.success({
                    title: "¡Hasta pronto!",
                    message: "Sesión cerrada",
                });
    
                document.addEventListener('iziToast-closed', function(){
                    window.location.href = "/";
                });
            } else if (respuesta == "anonimo") {
                iziToast.warning({
                    title: "Anónimo...",
                    message: "No hay sesión iniciada.",
                });
            } else {
                iziToast.error({
                    title: "¡Oops!",
                    message: "Ha ocurrido un error...",
                });
            }
        });
            
        conexion.fail(function(jqXHR, textStatus, errorThrown) {
            console.log("Error de solicitud: " + textStatus + errorThrown);
        });
    });
});
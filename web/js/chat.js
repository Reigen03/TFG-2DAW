// Cuando se cargue la página, se ejecutará esta función.
$(document).ready(function() {
    // Esta función realiza una petición GET al backend para comprobar si la sesión está iniciada. Si es así, cogerá la img.
    var conexion = $.ajax({
        url: "/sesionIniciada",
        type: "GET",
        dataType: "text"
    });
        
    conexion.done(function(img) {
        // Al darle click al botón se recogerá el texto, se mostrará el mensaje y este se enviará al backend.
        $("#btnTexto").on("click", function() {
            var txtUsu = $("#cuadroTexto").val();

            if (txtUsu == "" || txtUsu == " ") {
                iziToast.warning({
                    title: "¡Mucho vacío!",
                    message: "Escribe algo, anda",
                });
            } else {
                let msjUsu =
                `<div class="msg msgUsu">
                    <div class="img imgUsu" style="background-image: url(../../img/usr/${img});"></div>
                    <div class="txt txtUsu">${txtUsu}</div>
                </div>`;

                $("#chat").append(msjUsu);
                $("#cuadroTexto").val(null);

                botContesta(txtUsu);
            }
        });

        // Al presionar enter se recogerá el texto, se mostrará el mensaje y este se enviará al backend.
        $(document).keypress(function(tecla) {
            if (tecla.key == "Enter") {
                var txtUsu = $("#cuadroTexto").val();

                if (txtUsu == "" || txtUsu == " ") {
                    iziToast.warning({
                        title: "¡Mucho vacío!",
                        message: "Escribe algo, anda",
                    });
                } else {
                    let msjUsu =
                    `<div class="msg msgUsu">
                        <div class="img imgUsu" style="background-image: url(../../img/usr/${img});"></div>
                        <div class="txt txtUsu">${txtUsu}</div>
                    </div>`;

                    $("#chat").append(msjUsu);
                    $("#cuadroTexto").val(null);

                    botContesta(txtUsu);
                }
            }
        });
    });
        
    conexion.fail(function(jqXHR, textStatus, errorThrown) {
        console.log("Error de solicitud: " + textStatus + errorThrown);
    });
});


// Esta función recogerá el texto del mensaje del usuario para enviarlo al backend. Luego recibirá una respuesta y la pondrá en el chat.
function botContesta(textoUsuario) {
    let mensaje = $(`<div class="msg msgbot"></div>`);
    let imagenBot = $(`<div class="img imgBot"></div>`);
    let textoBot = $(`<div class="txt txtBot"></div>`);

    let circulos = $(`<div id="circulos"></div>`);
    let circulo1 = $(`<div class="circulillo" id="c1"></div>`);
    let circulo2 = $(`<div class="circulillo" id="c2"></div>`);
    let circulo3 = $(`<div class="circulillo" id="c3"></div>`);

    mensaje.append(imagenBot);
    mensaje.append(textoBot);
    textoBot.append(circulos);
    circulos.append(circulo1);
    circulos.append(circulo2);
    circulos.append(circulo3);

    $("#chat").append(mensaje);

    var conexion = $.ajax({
        url: `/bot/${textoUsuario}`,
        type: "POST",
    });

    conexion.done(function(respuesta) {
        setTimeout(function() {
            mensaje.append(textoBot);
            textoBot.text(respuesta);
        }, 850);
        
        $("#chat").scrollTop($("#chat")[0].scrollHeight);
    });
        
    conexion.fail(function(jqXHR, textStatus, errorThrown) {
        console.log("Error de solicitud: " + textStatus + errorThrown);
    });
}
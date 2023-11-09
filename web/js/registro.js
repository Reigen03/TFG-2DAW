/* Al pulsar al botón de la página de registro, recoge los datos del formulario, luego los manda a revisar. Si 
está todo correcto subirá la imagen al servidor y registrará al usuario, usando para ello dos peticiones al backend. */
$(document).ready(function() {
    $("#btnRegistro").on("click", function() {
        let nombre = $("#nomRegistro").val();
        let mail1 = $("#mailRegistro1").val();
        let mail2 = $("#mailRegistro2").val();
        let pass1 = $("#passRegistro1").val();
        let pass2 = $("#passRegistro2").val();
        let img = $("#imgRegistro").val();

        img = img.split('\\');
        let nombreImg = img[img.length-1];

        let camposCorrectos = comprobarCampos(nombre, mail1, mail2, pass1, pass2, nombreImg);

        if (camposCorrectos == true) {
            const imagen = $("#imgRegistro").get(0).files[0];
            const formData = new FormData();

            formData.append('image', imagen);

            subirImagen(formData);
            registrarUsuario(nombre, mail1, pass1, nombreImg);
        }            
    });
});

// Revisamos los campos necesarios para que sean correctos y válidos.
function comprobarCampos(nombre, mail1, mail2, pass1, pass2, nombreImg) {
    $(".mensajeError").text("");
    let inputsCorrectos = 0;
    let todoBien = false;

    let regexNom = /^[A-Za-z ]{3,75}$/;
    let regexMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let regexPass = /^((?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\S+$)).{8,25}$/;
    let extensionImg = nombreImg.split(".")[1];
    
    regexNom.test(nombre) ? inputsCorrectos++ : $("#errorNombre").text("Introduce un nombre entre 3 y 75 carácteres.");

    regexMail.test(mail1) ? inputsCorrectos++ : $("#errorMail1").text("Introduce un email válido.");

    mail1 == mail2 ? inputsCorrectos++ : $("#errorMail2").text("Los dos campos de email deben coincidir.");

    regexPass.test(pass1) ? inputsCorrectos++ : $("#errorPass1").text("Debe tener entre 8 y 25 carácteres, y contener mayúsculas, minúsculas, números y carác. especiales.");

    pass1 == pass2 ? inputsCorrectos++ : $("#errorPass2").text("Los dos campos de contraseña deben coincidir.");

    if (extensionImg == "png" || extensionImg == "jpg" || extensionImg == "jpeg" || extensionImg == "gif")
        inputsCorrectos++;
    else
        $("#errorImg").text("Debes subir un archivo de imagen válido.");

    if (inputsCorrectos == 6)
        todoBien = true;

    return todoBien;
}

/* Hacemos la petición POST al backend para crear el usuario nuevo. Si devuelve que está creado, mostrará un mensaje
para informar al usuario y al cerrar este, se le llevará a la página de inicio de sesión. Si da error simplemente 
mostrará el mensaje. */
function registrarUsuario(nombre, mail1, pass1, nombreImg) {
    var conexion = $.ajax({
        url: `/usuario/${nombre}/${mail1}/${pass1}/${nombreImg}`,
        type: "POST",
        dataType: "text"
    });
        
    conexion.done(function(respuesta) {
        if (respuesta == "creado") {
            iziToast.success({
                title: "¡Usuario creado!",
                message: "Ve a iniciar sesión",
            });

            document.addEventListener('iziToast-closed', function(){
                window.location.href = "/login";
            });
        } else {
            iziToast.error({
                title: "Error.",
                message: "Correo ya utilizado",
            });
        }
    });
        
    conexion.fail(function(jqXHR, textStatus, errorThrown) {
        console.log("Error de solicitud: " + textStatus + errorThrown);
    });
}

// Esta función recoge el objeto de la imagen y envía una petición POST a un php, que subirá la imagen.
function subirImagen(formData) {
    var conexion = $.ajax({
        url: "/subirImg",
        type: "POST",
        data: formData,
        contentType: false,
		processData: false,
    });
        
    conexion.fail(function(jqXHR, textStatus, errorThrown) {
        console.error("No se ha subido la imagen. " + textStatus + errorThrown);
    });
}
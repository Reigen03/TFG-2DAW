// Importamos el modelo de usuarios que hemos creado.
const modeloUsuarios = require('../modelos/usuarios');

// Función para crear usuario en la BD. Será llamada desde el index.js.
exports.crearUsuario = function(name, mail, pass, img, callback) {
    let datosUsu = {
        nombre: name,
        email: mail,
        passwd: pass,
        imgPerfil: img
    };

    modeloUsuarios.create(datosUsu, (error, result) => {
        if (error) {
          callback(error);
        } else {
          callback(null, result);
        }
    });
}

// Función para hacer la consulta del usuario. Será llamada desde el index.js.
exports.consultarUsuario = function(correo, contra, callback) {
    let datosUsu = {
        email: correo, 
        passwd: contra
    };

    modeloUsuarios.findOne(datosUsu, (error, result) => {
        if (error) {
            callback(error);
        } else {
            const hayDatos = result !== null; // Devuelve true si se encontraron datos, false en caso contrario.
            callback(null, hayDatos);
        }
    });
}

// Función para obtener el nombre de la imagen de usuario.
exports.consultarImg = async function(mail) {
    try {
        let datosUsu = {
            email: mail
        }

        const usuario = await modeloUsuarios.findOne(datosUsu).exec();

        if (usuario) {
          const imagen = usuario.imgPerfil;
          return imagen;
        } else {
          throw new Error('Usuario no encontrado');
        }
    } catch (error) {
        throw new Error('Error al obtener la imagen de perfil' + error);
    }
}
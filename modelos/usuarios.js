// Importamos la librería mongoose para crear el schema.
const mongoose = require('mongoose');

// Creamos una plantilla del schema de los usuarios, indicando sus valores.
const schemaUsuario = new mongoose.Schema(
    {
        nombre: {
            type: String
        },

        email: {
            type: String,
            unique: true,
            required: true
        },

        passwd: {
            type: String
        },

        imgPerfil: {
            type: String,
            default: "",
        }
    }
);

// Establecemos un modelo para los usuarios con el schema establecido.
module.exports = mongoose.model("usuario", schemaUsuario);
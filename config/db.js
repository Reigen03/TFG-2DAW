// Importamos la librería mongoose, que nos realizará la conexión.
const mongoose = require('mongoose');

// Cambiamos la opción strictQuery a false para que no de problemas de compatibilidad en futuras versiones de Mongoose.
mongoose.set('strictQuery', false);

// Establecemos los parámetros de conexión
const DB_URI = "mongodb://127.0.0.1:27017/insightbot";

const CONFING = {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}

const RESPONSE = function(err) {
    if(err)
        throw err;
    else
        console.log("> Conectado correctamente a la BD de Insight Bot.");
}

// Creamos una función que se conectará a la BD, pasando por parámetros la uri, configuraciones y la response.
exports.conexion = function() {
    mongoose.connect(DB_URI, CONFING, RESPONSE);
}
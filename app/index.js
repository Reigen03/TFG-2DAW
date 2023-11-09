// Importamos la librerías y dependencias necesarias.
const express = require('express');
const session = require('express-session');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const claveSecreta = require('../config/generarClave');
const cleverbot = require('cleverbot-free');
const conectarDB = require('../config/db');
const contUsuarios = require('../controladores/usuarios');


// Creamos la aplicación Express y una constante con el puerto.
const app = express();
const port = 3000;


// Conectamos la aplicación a nuestra BD y la inciamos.
conectarDB.conexion();

app.listen(port, () => {
    console.log(`> Escuchando por el puerto ${port}.`);
    console.log(`> Inicio: http://localhost:${port}/` + "\n");
});


// Generamos una clave secreta y configuramos la sesión, pero no se creará hasta que no se inicie sesión.
const clave = claveSecreta.generar();

app.use(session({
    secret: clave,
    resave: false,
    saveUninitialized: false
}));


// Indicamos las carpetas de recursos y ficheros de código. Indicamos la ruta de subida de imágenes. 
app.use(express.static('recursos'));
app.use(express.static('web'));

const subida = multer({
    dest: "recursos/img/usr/"
});

  
// Indicamos los html que se cargarán según que ruta se indique en la url. Por defecto se inicará en index.html.
app.use("/", express.static("web/html"));
app.use("/registro", express.static("web/html/registro.html"));
app.use("/login", express.static("web/html/login.html"));
app.use("/info", express.static("web/html/info.html"));


// Petición POST para el chatbot. Recibirá el mensaje del usuario y, con la librería de cleverbot, devolverá la respuesta.
app.post('/bot/:msg', (req, res) => {
    cleverbot(req.params.msg).then(respuesta => res.send(respuesta));
});


// Petición POST para cuando se registre un usuario. Esta función recibirá los datos para crearlo.
app.post('/usuario/:name/:mail/:pass/:img', (req, res) => {
    let name = req.params.name;
    let mail = req.params.mail;
    let pass = req.params.pass;
    let img = req.params.img;

    contUsuarios.crearUsuario(name, mail, pass, img, (error, result) => {
        error ? res.send("error") : res.send("creado");
    });
});


// Petición POST para cuando inicie sesión un usuario. Esta función recibirá los datos y creará la sesión.
app.post('/login/:mail/:pass', (req, res) => {
    let mail = req.params.mail;
    let pass = req.params.pass;

    contUsuarios.consultarUsuario(mail, pass, (error, hayDatos) => {
        if (error) {
            res.send("error");
        } else {
            if (hayDatos) {
                req.session.usuario = mail;
                
                res.send("correcto");
            } else {
                res.send("incorrecto");
            }
        }
    });
});


// Petición GET para la comprobación de sesión iniciada. Si hay sesión, se obtendrá la imagen de esta para mostrarla.
app.get('/sesionIniciada', async (req, res) => {
    try {
        const usuario = req.session.usuario;

        if (usuario == undefined) {
            res.send("anonimo.png");
        } else {
            const img = await contUsuarios.consultarImg(usuario);
            res.send(img);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});


// Petición GET para cuando el usuario quiera cerrar la sesión.
app.get('/logout', (req, res) => {
    if (req.session.usuario == undefined) {
        res.send("anonimo");
    } else {
        req.session.destroy(function(err) {
            err ? res.send("error") : res.send("correcto");
        });
    }
});


// Petición POST la subida de imágenes. Usando multer, recogemos el archivo y lo subimos con fs.
app.post('/subirImg', subida.single('image'), (req, res) => {
    const ficheroSubido = req.file;

    const carpetaDestino = path.join(__dirname, "../recursos/img/usr/");
    const rutaDestino = path.join(carpetaDestino, ficheroSubido.originalname);

    fs.rename(ficheroSubido.path, rutaDestino, (error) => {
        if (error) {
          console.error(`Error al guardar la imagen: ${error}`);
          return res.status(500).send("Error al guardar la imagen");
        }
    });
});
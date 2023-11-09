// Esta función genera una cadena aleatoria de 20 dígitos. Es usada para crear una clave secreta única en las sesiones.
exports.generar = function() {
    var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]\:;?><,./-=';
    var clave = '';
    
    for (var i = 0 ; i < 20 ; i++) {
      var indice = Math.floor(Math.random() * caracteres.length);
      clave += caracteres.charAt(indice);
    }
    
    return clave;
}
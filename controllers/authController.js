const passport = require("passport");

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/administracion',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true, //mensajes de alerta de flash
    badRequestMessage: 'Ambos campos son obligatorios'
})
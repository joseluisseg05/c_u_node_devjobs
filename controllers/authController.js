const passport = require("passport");
const mongoose = require('mongoose');
const Vacantes = mongoose.model('Vacante')

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/administracion',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true, //mensajes de alerta de flash
    badRequestMessage: 'Ambos campos son obligatorios'
})

//revisas autenticacion
exports.verificarAuth = (req, res, next) => {
    if(req.isAuthenticated()) return next() // estas ok

    res.redirect('/iniciar-sesion');
}

exports.mostrarPanel = async(req, res) => {
    const vacantes = await Vacantes.find({autor : req.user._id});

    res.render('administracion', {
        nombrePag: 'Panel de administración',
        tagline: 'Crea y Administra tus vacantes desde aquí',
        vacantes
    })
}
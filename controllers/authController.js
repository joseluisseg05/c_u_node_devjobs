const passport = require("passport");
const mongoose = require('mongoose');
const crypto = require('crypto');

const Vacantes = mongoose.model('Vacante');
const Usuarios = mongoose.model('Usuarios');

const enviarEmail = require('../handers/email');

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
        vacantes,
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen
    })
}

exports.cerrarSesion = (req, res) =>{
    req.logout();
    req.flash('correcto', 'Haz cerrado tu sesión');
    
    return res.redirect('/iniciar-sesion');
}

exports.formRestablecer = (req, res) => {
    res.render('reestablecer', {
        nombrePag: 'Restablece tu Contraseña',
        tagline: 'Si has olvidado tu contraseña coloca tu correo para contactarte'
    });
}

exports.enviarToken = async(req, res, next) => {
    const usuario = await Usuarios.findOne({email: req.body.email});

    if(!usuario){
        req.flash('error', 'No existe esa cuenta');
        return res.redirect('/iniciar-sesion');
    }

    usuario.token = crypto.randomBytes(30).toString('hex');
    usuario.expira = Date.now() + 3600000;

    await usuario.save();

    const resetUrl = `http://${req.headers.host}/reestablecer-pass/${usuario.token}`;
    
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reset'
    })

    req.flash('correcto', 'Revisa tu correo para las indicaciones.');
    res.redirect('/iniciar-sesion');
}

exports.reestablecerPassword = async(req, res) =>{
    const usuario = await Usuarios.findOne({
        token: req.params.token,
        expira: {
            $gt: Date.now()
        }
    });

    if(!usuario){
        req.flash('error', 'Formulario invalido, intenta de nuevo');
        return res.redirect('/reestablecer-pass');
    }

    res.render('nuevo-pass', {
        nombrePag: 'Nueva Contraseña'
    })
}

exports.guardarNuevoPass= async(req, res) => {
    const usuario = await Usuarios.findOne({
        token: req.params.token,
        expira: {
            $gt: Date.now()
        }
    });

    if(!usuario){
        req.flash('error', 'Formulario invalido, intenta de nuevo');
        return res.redirect('/reestablecer-pass');
    }

    usuario.password = req.body.password;
    usuario.token = undefined;
    usuario.expira = undefined;

    await usuario.save();

    req.flash('correcto', 'Contraseña modificada');
    res.redirect('/iniciar-sesion')
}
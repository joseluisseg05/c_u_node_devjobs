const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');

exports.mostrarTrabajos = async (req, res, next) => {
    const vacantes = await Vacante.find();
    if ( !vacantes ) return next();

    res.render('home', {
        nombrePag: 'devJobs',
        tagline: 'Encuentra y Pública Trabajos para Desarrolladores',
        barra: true,
        boton: true,
        vacantes
    })   
}
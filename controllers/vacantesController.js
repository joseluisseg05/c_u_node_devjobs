const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');

exports.formularioNueva = (req, res) =>{
    res.render('nueva-vacante', {
        nombrePag: 'Nueva Vacante',
        tagline: 'Llena el formulario y pubica tu vacante'
    })
}

exports.agregar = async (req, res) => {
    const vacante = new Vacante(req.body);// se mapea 
    vacante.skills = req.body.skills.split(',');

    const nuevaVacante = await vacante.save();
    console.log(nuevaVacante)
    res.redirect(`/vacantes/${nuevaVacante.url}`);
}
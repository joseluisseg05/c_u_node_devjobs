const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');

exports.formularioNueva = (req, res) =>{
    res.render('nueva-vacante', {
        nombrePag: 'Nueva Vacante',
        tagline: 'Llena el formulario y pubica tu vacante',
        cerrarSesion: true,
        nombre: req.user.nombre
    })
}

exports.agregar = async (req, res) => {
    const vacante = new Vacante(req.body);// se mapea

    vacante.autor = req.user._id;//como ya esta autenticado toma el id
    vacante.skills = req.body.skills.split(',');

    const nuevaVacante = await vacante.save();
    
    res.redirect(`/vacantes/${nuevaVacante.url}`);
}

exports.mostrarDetalle = async(req, res, next) => {
    const vacante = await Vacante.findOne({url: req.params.url});

    if (!vacante ) return next();

    res.render('vacante', {
        nombrePag: vacante.titulo,
        vacante,
        barra: true
    })
}

exports.formularioEditar = async(req, res, next) => {
    const vacante = await Vacante.findOne({url: req.params.url});

    if(!vacante) return next()

    res.render('editar-vacante', {
        nombrePag: `Editar - ${vacante.titulo}`,
        vacante,
        cerrarSesion: true,
        nombre: req.user.nombre
    })
}

exports.editarInfo = async (req, res) => {
    const vacanteAct = req.body;
    vacanteAct.skills = req.body.skills.split(',');

    const vacante = await Vacante.findOneAndUpdate( 
        { url: req.params.url }, 
        vacanteAct,{
            new: true,
            runValidators: true
        }
    );

    res.redirect(`/vacantes/${vacante.url}`)
}
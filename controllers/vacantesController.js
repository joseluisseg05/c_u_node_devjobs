exports.formularioNueva = (req, res) =>{
    res.render('nueva-vacante', {
        nombrePag: 'Nueva Vacante',
        tagline: 'Llena el formulario y pubica tu vacante'
    })
}
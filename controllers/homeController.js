exports.mostrarTrabajos = (req, res) => {
    res.render('home', {
        nombrePag: 'devJobs',
        tagline: 'Encuentra y Pública Trabajos para Desarrolladores',
        barra: true,
        boton: true
    })   
}
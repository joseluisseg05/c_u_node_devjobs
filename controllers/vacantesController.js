const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const shortId = require('shortid');

exports.formularioNueva = (req, res) =>{
    res.render('nueva-vacante', {
        nombrePag: 'Nueva Vacante',
        tagline: 'Llena el formulario y pubica tu vacante',
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen
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
    const vacante = await Vacante.findOne({url: req.params.url}).populate('autor');

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
        nombre: req.user.nombre,
        imagen: req.user.imagen
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

exports.validar = async(req, res, next) => {
    const reglas = [
        body('titulo').notEmpty().withMessage('El titulo es necesario.').escape(),
        body('empresa').notEmpty().withMessage('La empresa es un dato necesario.').escape(),
        body('ubicacion').notEmpty().withMessage('La ubicación es un dato necesario.').escape(),
        body('salario').escape(),
        body('contrato').notEmpty().withMessage('El contrato es un dato necesario.').escape(),
        body('skills').notEmpty().withMessage('Debe de tener almenos una skill.').escape(),
    ];

    await Promise.all(reglas.map(validation => validation.run(req)));
    const errores = validationResult(req);

    if(errores.isEmpty()) return next()

    req.flash('error', errores.array().map(error => error.msg));
    res.render('nueva-vacante', {
        nombrePag: 'Nueva Vacante',
        tagline: 'Llena el formulario y pubica tu vacante',
        cerrarSesion: true,
        nombre: req.user.nombre,
        mensajes: req.flash()
    })
}

exports.eliminar = async (req, res) => {
    const { id } = req.params;
    const vacante = await Vacante.findById(id);

    if(verificarAutor(vacante, req.user)) {
        //enviar mensaje a sweetalert 
        vacante.remove();
        res.status(200).send('Vacante Eliminada Correctamente')
    } else 
        res.status(403).send('Error')
        
}

const verificarAutor = (vacante= {}, usuario = {}) => {
    if(!vacante.autor.equals(usuario._id)) return false
    
    return true;
}

exports.subirCV = (req, res, next) => {
    upload(req, res, function(error){
        if (error ){
            if(error instanceof multer.MulterError) {
                if (error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'La imagen que trata de subir es muy grande: Maximo 200Kb ');
                } else {
                    req.flash('error', req.message);
                }
            }
            else {
                req.flash('error', error.message);
            }
            console.log(error);
            res.redirect('back');
            return;
        } else 
            next();
    });
}
const configMulter = {
    limits: {
        fileSize: 200000
    },
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) =>{
            cb(null, __dirname + '../../public/uploads/cv');
        },
        filename: (res, file, cb) => {
            const extencion = file.mimetype.split('/')[1];
            cb(null, `${shortId.generate()}.${extencion}`);
            
        }
    }),
    fileFilter(req, file, cb ) {
        if(file.mimetype === 'application/pdf') {
            cb(null, true)
        } else {
            cb(new Error('Formato de CV no valido'))
        }
    }
}

const upload = multer(configMulter).single('cv');//cv viene del nombre del campo de la vista

exports.contactar = async(req, res, next) => {
    const vacante = await Vacante.findOne({url: req.params.url});

    if(!vacante) return next();

    const nuevoCandidato = {
        nombre: req.body.nombre,
        email: req.body.email,
        //telefono: req.body.telefono,
        cv: req.file.filename
    }

    vacante.candidatos.push(nuevoCandidato);
    await vacante.save();

    req.flash('correcto', 'Se ha enviado tu CV al reclutador');
    res.redirect('/');
}

exports.mostrarCandidatos = async(req, res, next) => {
    const vacante = await Vacante.findById(req.params.id);

    if(!vacante) return next();
    if (vacante.autor != req.user._id.toString()) return next();

    res.render('candidatos', {
        nombrePag: `Candidatos Para ${vacante.titulo}`,
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen,
        candidatos: vacante.candidatos
    })
}

exports.buscar = async(req, res) =>{
    const vacantes = await Vacante.find({
        $text: { //agregadores en mongodb
            $search: req.body.q
        }
    });

    res.render('home', {
        nombrePag: `Resultados para la búsqueda: ${req.body.q}`,
        barra: true,
        vacantes
    })
}
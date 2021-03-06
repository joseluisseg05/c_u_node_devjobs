const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuarios');

const { body, validationResult } = require('express-validator');
const multer = require('multer');
const shortId = require('shortid');

exports.formCrear= (req, res) => {
    res.render('crear-cuenta', {
        nombrePag: 'Crea tu cuenta en devJobs',
        tagline: 'Publica tus vacantes gratis, solo debes de crear una cuenta'
    })
}

exports.crearNuevo = async(req, res, next) => {
    const usuario = new Usuarios(req.body);

    try {
        await usuario.save();
        res.redirect('/iniciar-sesion');
    } catch (error) { // los errores de mongo (dublicidad)
        req.flash('error', error);
        res.redirect('/crear-cuenta');
    }
}

exports.validarRegistro= async(req, res, next) => {
    const reglas = [ // reaglas para la validacion y la sanitizacion de los datos
        body('nombre').notEmpty().withMessage('El nombre es Obligatorio').escape(),
        body('email').isEmail().withMessage('El email debe ser valido').escape(),
        body('password').notEmpty().withMessage('El password no puede ir vacío').escape(),
        body('confirmar').notEmpty().withMessage('La confirmacion de la contraseña no puede ir vacío').escape(),
        body('confirmar').equals(req.body.password).withMessage('El password es diferente').escape()
    ];
    await Promise.all(reglas.map( validation => validation.run(req)));
    const errores = validationResult(req);
    
    if(errores.isEmpty()) return next(); // si no hay errores

    req.flash('error', errores.array().map(error => error.msg));
    res.render('crear-cuenta', {
        nombrePag: 'Crea tu cuenta en devJobs',
        tagline: 'Publica tus vacantes gratis, solo debes de crear una cuenta',
        mensajes: req.flash()
    });

    return;
}

exports.formIniciarSesion = (req, res) =>{
    res.render('iniciar-sesion', {
        nombrePag: 'Iniciar Sesión devJobs'
    })
}

exports.formEditarPerfil = (req, res) => {
    res.render('editar-perfil', {
        nombrePag: 'Edita tu perfil en devJobs',
        usuario: req.user,
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen
    })
}

exports.editarPerfil = async(req, res) => {
    const usuario = await Usuarios.findById(req.user._id);

    usuario.nombre = req.body.nombre;
    usuario.email = req.body.email;

    if(req.body.password)
        usuario.password = req.body.password
    
    if(req.file)
        usuario.imagen = req.file.filename;

    await usuario.save();

    req.flash('correcto', 'Cambios guardados Correctamente')

    res.redirect('/administracion');
}

exports.validarPerfil = async(req, res, next) => {
    //#region 
    //forma de realizar la validacion en un controlador 
    //y evaluar las entradas del body en un arreglo 
    //para mandarlo por flash
    const reglas = [
        body('nombre').notEmpty().withMessage('El nombre es Obligatorio').escape(),
        body('email').isEmail().withMessage('El email debe ser valido').escape()
    ];
    
    if(req.body.password) 
        reglas.push(body('password').notEmpty().withMessage('El password no puede ir vacío').escape());
    
    await Promise.all(reglas.map( validation => validation.run(req)));
    const errores = validationResult(req);

    if(errores.isEmpty()) return next(); // si no hay errores

    req.flash('error', errores.array().map(error => error.msg));
    //#endregion
    res.render('editar-perfil', {
        nombrePag: 'Edita tu perfil en devJobs',
        usuario: req.user,
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen,
        mensajes: req.flash(),
    })

}

exports.subirImagen = (req, res, next) => {
    upload(req, res, function(error){
        if (error ){
            if(error instanceof multer.MulterError) {
                if (error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'La imagen que trata de subir es muy grande: Maximo 100Kb ');
                } else {
                    req.flash('error', req.message);
                }
            }
            else {
                req.flash('error', error.message);
            }
            res.redirect('/administracion');
            return;
        } else 
            next();
    });
}
const configMulter = {
    limits: {
        fileSize: 100000
    },
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) =>{
            cb(null, __dirname + '../../public/uploads/perfiles');
        },
        filename: (res, file, cb) => {
            const extencion = file.mimetype.split('/')[1];
            cb(null, `${shortId.generate()}.${extencion}`);
            
        }
    }),
    fileFilter(req, file, cb ) {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true)
        } else {
            cb(new Error('Formato de Imagen no valido'), false)
        }
    }
}

const upload = multer(configMulter).single('imagen');


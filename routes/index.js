const express = require('express');
const router = express.Router();

const homeC = require('../controllers/homeController')
const vacanteC = require('../controllers/vacantesController');
const usuariosC = require('../controllers/usuariosController');
const authC = require('../controllers/authController');

module.exports = () => {
    router.get('/', homeC.mostrarTrabajos);

    //vacantes
    router.get('/vacantes/nueva', authC.verificarAuth, vacanteC.formularioNueva);
    router.post('/vacantes/nueva', authC.verificarAuth, vacanteC.validar, vacanteC.agregar);

    //mostrar una vacante 
    router.get('/vacantes/:url', vacanteC.mostrarDetalle);
    //editar vacante
    router.get('/vacantes/editar/:url', authC.verificarAuth, vacanteC.formularioEditar);
    router.post('/vacantes/editar/:url', authC.verificarAuth, vacanteC.validar, vacanteC.editarInfo);

    //eliminar vacante
    router.delete('/vacantes/eliminar/:id', vacanteC.eliminar);

    //crear cuentas 
    router.get('/crear-cuenta', usuariosC.formCrear);
    router.post('/crear-cuenta', usuariosC.validarRegistro, usuariosC.crearNuevo);

    //autenticar
    router.get('/iniciar-sesion', usuariosC.formIniciarSesion);
    router.post('/iniciar-sesion', authC.autenticarUsuario);

    //cerrar
    router.get('/cerrar-sesion', authC.verificarAuth, authC.cerrarSesion);
    
    //administracion
    router.get('/administracion', authC.verificarAuth, authC.mostrarPanel);

    //editar perfil
    router.get('/editar-perfil', authC.verificarAuth, usuariosC.formEditarPerfil);
    router.post('/editar-perfil', 
        authC.verificarAuth, 
        //usuariosC.validarPerfil, 
        usuariosC.subirImagen,
        usuariosC.editarPerfil
    );

    //candidatos
    router.post('/vacantes/:url', vacanteC.subirCV, vacanteC.contactar);
    router.get('/candidatos/:id', authC.verificarAuth, vacanteC.mostrarCandidatos);

    return router;
}
const express = require('express');
const router = express.Router();

const homeC = require('../controllers/homeController')
const vacanteC = require('../controllers/vacantesController');
const usuariosC = require('../controllers/usuariosController');

module.exports = () => {
    router.get('/', homeC.mostrarTrabajos);

    //vacantes
    router.get('/vacantes/nueva', vacanteC.formularioNueva);
    router.post('/vacantes/nueva', vacanteC.agregar);

    //mostrar una vacante 
    router.get('/vacantes/:url', vacanteC.mostrarDetalle);
    //editar vacante
    router.get('/vacantes/editar/:url', vacanteC.formularioEditar);
    router.post('/vacantes/editar/:url', vacanteC.editarInfo);


    //crear cuentas 
    router.get('/crear-cuenta', usuariosC.formCrear);
    router.post('/crear-cuenta', usuariosC.validarRegistro, usuariosC.crearNuevo);

    return router;
}
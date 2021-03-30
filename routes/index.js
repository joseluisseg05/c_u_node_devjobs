const express = require('express');
const router = express.Router();

const homeC = require('../controllers/homeController')
const vacanteC = require('../controllers/vacantesController');

module.exports = () => {
    router.get('/', homeC.mostrarTrabajos);

    //vacantes
    router.get('/vacantes/nueva', vacanteC.formularioNueva);

    return router;
}
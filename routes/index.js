const express = require('express');
const router = express.Router();

const homeC = require('../controllers/homeController')

module.exports = () => {
    router.get('/', homeC.mostrarTrabajos);


    return router;
}
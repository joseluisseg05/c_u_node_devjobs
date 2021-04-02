const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

require('dotenv').config({path: '.env'});

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology:true,
});

mongoose.connection.on('error', (error) => {
    console.log(error);
});

//importar modelos 
require('../models/Usuarios.js');
require('../models/vacantes');

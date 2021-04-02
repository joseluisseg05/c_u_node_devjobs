const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcryptjs');

const usuariosSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
    },
    nombre: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    }, 
    token: String,
    expira: Date, 
    imagen: String
});

// Método para hashear los passwords

usuariosSchema.pre('save', function(next) {
    // si el password ya esta hasheado
    if(!this.isModified('password')) {
        return next(); // deten la ejecución
    }
    // si no esta hasheado
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(this.password, salt);
    this.password = hash;
    next();
});

usuariosSchema.post('save', function(error, doc, next){
    //si es un error de mongo con el codigo especifico(duplicidad)
    if (error.name === 'MongoError' && error.code === 11000 ){
        next('El correo ya esta registrado');
    } else {
        next(error);
    }
});


module.exports = mongoose.model('Usuarios', usuariosSchema);
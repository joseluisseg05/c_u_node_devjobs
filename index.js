const mongoose = require('mongoose');
require('./config/db');

const express = require('express');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');

const passport = require('./config/passport');

const path = require('path');

require('dotenv').config({path: '.env'})

const router = require('./routes/index');

const app = express();

app.use(express.urlencoded({extends: true}));

app.engine('handlebars', 
    exphbs({
        handlebars: allowInsecurePrototypeAccess(handlebars),
        defaultLayout: 'layout',
        helpers: require('./helpers/handlebars')
    })
);
app.set('view engine', 'handlebars'); // si se pone el nombre completo asi debe de ir la extension

app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

//passport
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    res.locals.mensajes = req.flash();
    next();
})

app.use('/', router());

app.listen(process.env.PUERTO);
const mongoose = require('mongoose');
require('./config/db');

const express = require('express');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const path = require('path');

require('dotenv').config({path: '.env'})

const router = require('./routes/index');

const app = express();

app.engine('handlebars', 
    exphbs({
        defaultLayout: 'layout'
    })
);
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DATABASE,
        touchAfter: 24 * 3600
    })
}))

app.use('/', router());

app.listen(process.env.PUERTO);
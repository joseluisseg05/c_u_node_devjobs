const express = require('express');
const exphbs = require('express-handlebars');

const path = require('path');

const router = require('./routes/index');

const app = express();

app.engine('handlebars', 
    exphbs({
        defaultLayout: 'layout'
    })
);
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')))

app.use('/', router());

app.listen(8080);
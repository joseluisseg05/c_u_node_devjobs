const express = require('express');

const app = express();

app.use('/', (req, res) => {
    res.send('funcionando');
})

app.listen(8080);
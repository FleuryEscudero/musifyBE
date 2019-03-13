'use strict'

var mongoose = require ('mongoose');
var app = require('./app');
var port = 3700;

mongoose.connect('mongodb://localhost:27017/musify', { useNewUrlParser: true })

    .then (() => {
    console.log ('La conexion a MongoDb se ha realizado correctamente!');

    app.listen(port, () => {
    console.log ('El servidor esta corriendo en localhost:3700');
    })
    })
    .catch(err => console.log(err));
'use strict'

var express = require('express');
var bodyParser = require ('body-parser');
var cors =require ('cors');

var app = express ();


//cargar rutas
var musifyUserRoutes = require('./routes/musify.user.routes');
var musifyArtistRoutes = require('./routes/musify.artist.routes');
var musifyAlbumRoutes = require('./routes/musify.album.routes');
var musifySongsRoutes = require('./routes/musify.songs.routes');

//body-parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//configurar CORS
app.use(cors());

//rutas base

/*app.get('/pruebas-api', (req,res)=>{
    res.status(200).send({
        menssage:'Esta ruta es de prueba en mi api restful con mongo y node'
    });
} )*/

app.use('/api',musifyUserRoutes);
app.use('/api',musifyArtistRoutes);
app.use('/api',musifyAlbumRoutes);
app.use('/api',musifySongsRoutes);
module.exports = app;

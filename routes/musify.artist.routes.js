'use strict'

var express = require('express');
var cors = require('cors');

var musifyArtistController = require ('../controllers/musify.artists.controller');

var api = express.Router();
var mdAuth = require ('../middlewares/authenticate.middleware');

var multipart= require ('connect-multiparty');
var mdUpload = multipart({uploadDir: './uploads/artist'});

//Configuracion de Cabeceras
api.use(cors());
// Configurar cabeceras y cors
api.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


api.get('/artist/:id', mdAuth.ensureAuth ,musifyArtistController.getArtist);
api.post('/artist', mdAuth.ensureAuth ,musifyArtistController.saveArtist);
api.get('/artists/:page?', mdAuth.ensureAuth ,musifyArtistController.getArtists);
api.put('/artist/:id', mdAuth.ensureAuth ,musifyArtistController.updateArtist);
api.delete('/artist/:id', mdAuth.ensureAuth ,musifyArtistController.deleteArtist);
api.post('/uploadImageArtist/:id',[mdAuth.ensureAuth, mdUpload], musifyArtistController.uploadImageArtist);
api.get('/getImageArtist/:imageFile', musifyArtistController.getImageArtistFile);
module.exports = api;
'use strict'

var express = require('express');
var cors = require('cors');

var musifySongsController = require ('../controllers/musify.songs.controller');

var api = express.Router();
var mdAuth = require ('../middlewares/authenticate.middleware');

var multipart= require ('connect-multiparty');
var mdUpload = multipart({uploadDir: './uploads/songs'});

//Configuracion de Cabeceras
api.use(cors());
api.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Configuracion de Rutas 
api.post('/song', mdAuth.ensureAuth ,musifySongsController.saveSong);
api.get('/song/:id', mdAuth.ensureAuth ,musifySongsController.getSong);
api.get('/songs/:album?', mdAuth.ensureAuth ,musifySongsController.getSongs);
api.put('/song/:id', mdAuth.ensureAuth ,musifySongsController.updateSong);
api.delete('/song/:id', mdAuth.ensureAuth ,musifySongsController.deleteSong);
api.post('/uploadSongFile/:id',[mdAuth.ensureAuth, mdUpload], musifySongsController.uploadSongFile);
api.get('/getSongFile/:songFile', musifySongsController.getSongFile);
module.exports = api;
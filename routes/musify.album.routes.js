'use strict'

var express = require('express');
var cors = require('cors');

var musifyAlbumController = require ('../controllers/musify.album.controller');

var api = express.Router();
var mdAuth = require ('../middlewares/authenticate.middleware');

var multipart= require ('connect-multiparty');
var mdUpload = multipart({uploadDir: './uploads/albums'});

//Configuracion de Cabeceras
api.use(cors());
// Configurar cabeceras y cors



//Configuracion de Rutas 
api.get('/album/:id', mdAuth.ensureAuth ,musifyAlbumController.getAlbum);
api.get('/albums/:artist?', mdAuth.ensureAuth ,musifyAlbumController.getAlbums);
api.post('/album', mdAuth.ensureAuth ,musifyAlbumController.saveAlbum);
api.put('/album/:id', mdAuth.ensureAuth ,musifyAlbumController.updateAlbum);
api.delete('/album/:id', mdAuth.ensureAuth ,musifyAlbumController.deleteAlbum);
api.post('/uploadImageAlbum/:id',[mdAuth.ensureAuth, mdUpload], musifyAlbumController.uploadImageAlbum);
api.get('/getImageAlbum/:imageFile', musifyAlbumController.getImageAlbumFile);

module.exports = api;
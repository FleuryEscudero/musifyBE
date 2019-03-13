'use strict'

var express = require('express');
var cors = require('cors');

var musifyUserController = require ('../controllers/musify.user.controller');

var api = express.Router();
var mdAuth = require ('../middlewares/authenticate.middleware');

var multipart= require ('connect-multiparty');
var mdUpload = multipart({uploadDir: './uploads/users'});

//Configuracion de Cabeceras
api.use(cors());
api.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


api.get('/pruebas', mdAuth.ensureAuth ,musifyUserController.pruebas);
api.post('/register',musifyUserController.saveUser);
api.post('/login',musifyUserController.loginUser);
api.put('/update/:id',mdAuth.ensureAuth, musifyUserController.updateUser);
api.post('/uploadImage/:id',[mdAuth.ensureAuth, mdUpload], musifyUserController.uploadImage);
api.get('/getImageUser/:imageFile', musifyUserController.getImageFile);
module.exports = api;
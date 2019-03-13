'use strict'
var fs = require ('fs');
var path = require ('path');
var bcrypt=require('bcrypt-nodejs');
var User =require('../models/musify.user.models');
var jwt = require ('../services/jwt.service');


function pruebas(req, res) {
    res.status(200).send({
        menssage: 'Esta ruta es de prueba en mi api restful con mongo y node de musify'
    });
};


    function saveUser (req,res){
    var user = new User();

    var params = req.body;

    console.log(params);

        user.name =  params.name ;
        user.surname = params.surname ;
        user.email = params.email;
        user.role = 'roleUser';
        user.image = 'null';

        if (params.password){
            //encriptar y guardar el dato
            bcrypt.hash(params.password,null,null,function(err,hash){
                user.password=hash;

                if (user.name !=null && user.surname !=null  && user.email !=null){
                    user.save((err,userStored)=> {
                        if (err){
                            res.status(500).send({message: 'Error al guardar el usuario'});
                        }else{
                            if (!userStored){
                                res.status(404).send({message: 'No se ha registrado el usuario'});

                            }else {
                                res.status(200).send({user: userStored});

                            }

                        }
                    });
                }else{
                        res.status(200).send({message: 'Introduce todos los campos'});
                }
            });
        }else{
            res.status(200).send({message: 'Introduce la contraseña'});
        }
    }

    function loginUser (req,res){
        var params = req.body;

        var email = params.email;
        var password = params.password;

        User.findOne ({email: email.toLowerCase()}, (err, user) => {
            if (err){
                    res.status(500).send({message: 'Error en la peticion'});
            }else {
                if (!user){
                    res.status(404).send({message: 'El usuario no existe'});
                }else{
                    //comprobar password
                    bcrypt.compare(password,user.password,function(err, check){
                            if (check){
                                //devolver los datos del usuario  logueado
                                if(params.gethash){
                                    //devolver un token de jwt
                                    res.status(200).send({
                                        token: jwt.createToken(user)
                                    });
                                }else {
                                    res.status(200).send({user});
                                }

                            }else{
                                res.status(404).send({message: 'El usuario no ha podido loguearse'});
                            }
                    });
                }
            }
        } )
    }

    function updateUser (req,res){
        var userId = req.params.id;
        var update = req.body;

        if(userId != req.user.sub){
            return res.status(500).send({message: 'No tienes permiso para actualizar el usuario'});
        }
        User.findByIdAndUpdate (userId, update, (err, userUpdated) =>{
            if (err){
                res.status(500).send({message: 'Error al actualizar el usuario'});
            } else {
                if (!userUpdated){
                    res.status(404).send({message: 'El usuario no ha podido ser actualizado'});
                }else{
                    res.status(200).send({user: userUpdated});
                }
            }
        });

    }

    function uploadImage(req,res){
        var userId = req.params.id;
        var fileName = 'Imagen no subido...';

        if (req.files){
            console.log(req.files);
            var filePath = req.files.image.path;
            var fileSplit = filePath.split ('/');
            var fileName = fileSplit[2];

            var extSplit = fileName.split ('.');
            var fileExt = extSplit [1];
            
                if(fileExt=='png' || fileExt =='jpg' || fileExt =='gif'){

                    User.findByIdAndUpdate(userId, {image:fileName}, (err,userUpdated)=>{
                        
                            if (!userUpdated){
                                res.status(404).send({message: 'El usuario no ha podido ser actualizado'});
                            }else{
                                res.status(200).send({image: fileName ,user: userUpdated});
                            }                        
                    });
                }else{
                    res.status(200).send({message: 'Extension del archivo no valida'}); 
                }

        }else {
            res.status(200).send({message: 'La imagen no fue cargada'}); 
        }
    }


    function getImageFile (req,res){
        var imageFile = req.params.imageFile;
        var pathFile = './uploads/users/'+imageFile;
        fs.exists(pathFile, function(exists){
            if (exists){
                res.sendFile(path.resolve(pathFile));
            }else {
                res.status(200).send({message: 'No existe la imagen'});
            }
        });
    }


module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
        }
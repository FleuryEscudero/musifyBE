'use strict'

var fs = require ('fs');
var path = require ('path');
var mongoosePaginate = require ('mongoose-pagination');
var Album = require ('../models/musify.album.models');
var Song = require  ('../models/musify.song.models');


function getAlbum (req, res) {    
    var albumId = req.params.id;
    Album.findById(albumId).populate({path:'artist'}).exec((err,album)=> {
        if (err){
                res.status(500).send({message: ' Error en la petición'});
        }else{
            if (!album){
                console.log(!albumId);
                res.status(404).send({message: ' El album no existe'})
            }else{
                res.status(200).send({album});
            }
        }
    });
};

function getAlbums (req,res){
    
    var artistId = req.params.artist;

        if (!artistId){
            var find = Album.find({}).sort('title');
        }else {
            var find = Album.find({artist: artistId}).sort('year'); 
        }

        find.populate({path:'artist'}).exec((err,albums) => {
            if (err){
                res.status(500).send({message: ' Error en la petición'});
            }else {
                if(!albums){
                    console.log(!albumId);
                res.status(404).send({message: ' Este artista no tiene albums asociados'})
                }else {
                    res.status(200).send({albums});
                }
            }
        });    
}

function saveAlbum(req, res) {
    var album = new Album ();
    var params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save ((err, albumStored)=> {
        if (err){
            res.status(500).send({message: 'Error al guardar el album'});
        }else {
            if (!albumStored){
                res.status(500).send({message: 'El album no ha sido guardado'});
            }else{
                res.status(200).send({album: albumStored})
            }
        }

    
    });
};

function updateAlbum(req,res){
    var albumId = req.params.id;
    var update =req.body;
    
    Album.findByIdAndUpdate(albumId,update, (err, albumUpdated)=> {
        if (err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if (!albumUpdated){
                res.status(404).send({message: 'No existe el album'});
            }else {
                res.status(200).send({album: albumUpdated});
            }
        }
    });
}



function deleteAlbum (req, res){
    var albumId = req.params.id;
    
    Album.findByIdAndRemove(albumId, (err,albumDeleted) => {
        if (err){
            res.status(500).send({message: 'Error en el servidor'});
        }else {
            if(!albumDeleted){
                res.status(404).send({message: 'No existe el album'});
            }else {             
               Song.find({album: albumDeleted._id}).remove((err,songsDeleted)=>{
                if (err){
                    res.status(500).send({message: 'Error en el servidor'});
                }else {
                    if(!songsDeleted){
                        res.status(404).send({message: 'No existe las canciones de este album'});
                    }else {
                        res.status(200).send({album: albumDeleted}); 
                    }
                }
            })
        }
    }
});
}

function uploadImageAlbum(req,res){
    var albumId = req.params.id;
    var fileName = 'Imagen no subida...';

    if (req.files){
        var filePath = req.files.image.path;
        var fileSplit = filePath.split ('/');
        var fileName = fileSplit[2];

        var extSplit = fileName.split ('.');
        var fileExt = extSplit [1];
        
            if(fileExt=='png' || fileExt =='jpg' || fileExt =='gif'){

                Album.findByIdAndUpdate(albumId, {image:fileName}, (err,albumUpdated)=>{
                    if (err){
                        res.status(500).send({message: 'Error en el servidor'});
                    }else{ 
                        if (!albumUpdated){
                            res.status(404).send({message: 'El album no ha podido ser actualizado'});
                        }else{
                            res.status(200).send({album: albumUpdated});
                        }  
                    }                      
                });
            }else{
                res.status(200).send({message: 'Extension del archivo no valida'}); 
            }

    }else {
        res.status(200).send({message: 'La imagen no fue cargada'}); 
    }
}

function getImageAlbumFile (req,res){
    var imageFile = req.params.imageFile;
    var pathFile = './uploads/albums/'+imageFile;
    fs.exists(pathFile, function(exists){
        if (exists){
            res.sendFile(path.resolve(pathFile));
        }else {
            res.status(200).send({message: 'No existe la imagen'});
        }
    });
}

module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImageAlbum,
    getImageAlbumFile
        }
'use strict'

var fs = require ('fs');
var path = require ('path');
var mongoosePaginate = require ('mongoose-pagination');
var Artist = require ('../models/musify.artist.models');
var Album = require ('../models/musify.album.models');
var Song = require  ('../models/musify.song.models');


function getArtist(req, res) {
    var artistId = req.params.id;
     console.log(artistId);
    Artist.findById(artistId,(err,artist)=> {
        if (err){
                res.status(500).send({message: ' Error en la petición'});
        }else{
            if (!artist){
                console.log(!artistId);
                res.status(404).send({message: ' El artista no existe'})
            }else{
                res.status(200).send({artist});
            }
        }
    });
};

function saveArtist(req, res) {
    var artist = new Artist ();
    var params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save ((err, artistStored)=> {
        if (err){
            res.status(500).send({message: 'Error al guardar el artista'});
        }else {
            if (!artistStored){
                res.status(500).send({message: 'El artista no ha sido guardado'});
            }else{
                res.status(200).send({artist: artistStored})
            }
        }

    
    });
};

function getArtists (req,res){
    if(req.params.page){
        var page = req.params.page;
    }else {
        var page = 1;
    }
    
    var itemsPerPage = 6;

    Artist.find().sort('name').paginate(page,itemsPerPage, (err,artists,total) => {
        if (err){
            res.status(500).send({message: 'Erro en la petición'});
        }else {
            if (!artists){
                res.status(404).send({message: 'No hay artistas'});
            }else {
                return res.status(200).send({
                    totalItems:total,
                    artists: artists
                })
            }

        }
    });
}

function updateArtist (req,res) {
    var artistId = req.params.id;
    var update =req.body;
    
    Artist.findByIdAndUpdate(artistId,update, (err, artistUpdated)=> {
        if (err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if (!artistUpdated){
                res.status(404).send({message: 'No existe el artista'});
            }else {
                res.status(200).send({artist: artistUpdated});
            }
        }
    });
}

function deleteArtist (req, res){
    var artistId = req.params.id;
    

    Artist.findByIdAndRemove(artistId, (err,artistDeleted) => {
        if (err){
            res.status(500).send({message: 'Error en el servidor'});
        }else {
            if(!artistDeleted){
                res.status(404).send({message: 'No existe el artista'});
            }else {             
                Album.find({artist: artistDeleted._id}).remove((err, albumDeleted)=> {
                    if (err){
                        res.status(500).send({message: 'Error en el servidor'});
                    }else {
                        if (!albumDeleted){
                            res.status(404).send({message: 'No existe el album'});
                        } else {
                            Song.find({album: albumDeleted._id}).remove((err,songsDeleted)=>{
                                if (err){
                                    res.status(500).send({message: 'Error en el servidor'});
                                }else {
                                    if(!songsDeleted){
                                        res.status(404).send({message: 'No existe las canciones de este album'});
                                    }else {
                                        res.status(200).send({artist: artistDeleted}); 
                                    }
                                }
                            })
                        }
                    }
                })
            }

        }
    });

}

function uploadImageArtist(req,res){
    var artistId = req.params.id;
    var fileName = 'Imagen no subido...';

    if (req.files){
        var filePath = req.files.image.path;
        var fileSplit = filePath.split ('/');
        var fileName = fileSplit[2];

        var extSplit = fileName.split ('.');
        var fileExt = extSplit [1];
        
            if(fileExt=='png' || fileExt =='jpg' || fileExt =='gif'){

                Artist.findByIdAndUpdate(artistId, {image:fileName}, (err,artistUpdated)=>{
                    if (err){
                        res.status(500).send({message: 'Error en el servidor'});
                    }else{ 
                        if (!artistUpdated){
                            res.status(404).send({message: 'El artista no ha podido ser actualizado'});
                        }else{
                            res.status(200).send({artist: artistUpdated});
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


function getImageArtistFile (req,res){
    var imageFile = req.params.imageFile;
    var pathFile = './uploads/artist/'+imageFile;
    fs.exists(pathFile, function(exists){
        if (exists){
            res.sendFile(path.resolve(pathFile));
        }else {
            res.status(200).send({message: 'No existe la imagen'});
        }
    });
}
module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImageArtist,
    getImageArtistFile
        }
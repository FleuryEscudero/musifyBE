'use strict'

var fs = require ('fs');
var path = require ('path');
var mongoosePaginate = require ('mongoose-pagination');
var Artist = require ('../models/musify.artist.models');
var Album = require ('../models/musify.album.models');
var Song = require  ('../models/musify.song.models');


function getSong (req, res) {    
    var songId = req.params.id;
    Song.findById(songId).populate({path: 'album'}).exec((err,song)=> {
        if (err){
                res.status(500).send({message: ' Error en la petición'});
        }else{
            if (!song){
                console.log(!songId);
                res.status(404).send({message: ' La cancion no existe'})
            }else{
                res.status(200).send({song});
            }
        }
    });
};

function getSongs (req,res){
    
    var albumId = req.params.album;

        if (!albumId){
            var find = Song.find({}).sort('number');
        }else {
            var find = Song.find({album: albumId}).sort('number'); 
        }

        find.populate({path:'album'}).exec((err,songs) => {
            if (err){
                res.status(500).send({message: ' Error en la petición'});
            }else {
                if(!songs){
                    console.log(!albumId);
                res.status(404).send({message: ' Este artista no tiene canciones asociadas'})
                }else {
                    res.status(200).send({songs});
                }
            }
        });    
}


function saveSong (req, res) {
    var song = new Song ();
    var params = req.body;
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = 'null';
    song.album = params.album;

    song.save ((err, songStored)=> {
        if (err){
            res.status(500).send({message: 'Error al guardar la canción'});
        }else {
            if (!songStored){
                res.status(500).send({message: 'La canción no ha sido guardado'});
            }else{
                res.status(200).send({song: songStored})
            }
        }

    
    });
};


function updateSong(req,res){
    var songId = req.params.id;
    var update =req.body;
    
    Song.findByIdAndUpdate(songId,update, (err, songUpdated)=> {
        if (err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if (!songUpdated){
                res.status(404).send({message: 'No existe la canción'});
            }else {
                res.status(200).send({song: songUpdated});
            }
        }
    });
}



function deleteSong (req, res){
    var songId = req.params.id;
    
    Song.findByIdAndRemove(songId, (err,songDeleted) => {
        if (err){
            res.status(500).send({message: 'Error en el servidor'});
        }else {
            if(!songDeleted){
                res.status(404).send({message: 'No existe la canción'});
            }else {             
                res.status(200).send({song: songDeleted});  
                }
    }
});
}


function uploadSongFile(req,res){
    var songId = req.params.id;
    var fileName = 'cancion no subida...';

    if (req.files){
        var filePath = req.files.file.path;
        var fileSplit = filePath.split ('/');
        var fileName = fileSplit[2];

        var extSplit = fileName.split ('.');
        var fileExt = extSplit [1];
        
            if(fileExt=='mp3'){

                Song.findByIdAndUpdate(songId, {file:fileName}, (err,songUpdated)=>{
                    if (err){
                        res.status(500).send({message: 'Error en el servidor'});
                    }else{ 
                        if (!songUpdated){
                            res.status(404).send({message: 'la cancion no ha podido ser subida'});
                        }else{
                            res.status(200).send({song: songUpdated});
                        }  
                    }                      
                });
            }else{
                res.status(200).send({message: 'Extensión del archivo no valida'}); 
            }

    }else {
        res.status(200).send({message: 'La canción no fue cargada'}); 
    }
}


function getSongFile (req,res){
    var songFile = req.params.songFile;
    var pathFile = './uploads/songs/'+songFile;
    fs.exists(pathFile, function(exists){
        if (exists){
            res.sendFile(path.resolve(pathFile));
        }else {
            res.status(200).send({message: 'No existe la cancion'});
        }
    });
}
module.exports = {
    getSong,
    getSongs,
    saveSong,
    updateSong,
    deleteSong,
    uploadSongFile,
    getSongFile
        }
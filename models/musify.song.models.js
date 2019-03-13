'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var MusifySongSchemas = Schema ({number:Number,
                                name:String,
                                duration:String,
                                file:String,
                                album:{type:Schema.ObjectId, ref:'MusifyAlbum'}
                                });                   


module.exports = mongoose.model('MusifySong',MusifySongSchemas);
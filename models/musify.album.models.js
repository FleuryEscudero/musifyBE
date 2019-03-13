'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var MusifyAlbumSchema = Schema ({
                                title:String,
                                description:String,
                                year:Number,
                                image:String,
                                artist:{ type: Schema.ObjectId, ref: 'MusifyArtist' }
                                });
                             


module.exports = mongoose.model('MusifyAlbum',MusifyAlbumSchema);
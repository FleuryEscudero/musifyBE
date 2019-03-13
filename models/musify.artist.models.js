'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var MusifyArtistSchema = Schema ({
                                name:String,
                                description:String,
                                image:String
                                });                


module.exports = mongoose.model('MusifyArtist',MusifyArtistSchema);
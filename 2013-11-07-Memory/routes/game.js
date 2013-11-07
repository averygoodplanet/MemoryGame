var mongoose = require('mongoose');
var Game = mongoose.model('Game');

// var colors = require('colors');
// Colors
// bold, italic, underline, inverse, yellow, cyan,
// white, magenta, green, red, grey, blue, rainbow,
// zebra, random

/*
 * GET /
 */

exports.index = function(req, res){
  res.render('game/index', {title: 'Memory Game'});
};

// POST /new
exports.create = function(req, res){
  new Game(req.body).save(function(err, game){
    console.log('game: ' +game);
  });
};
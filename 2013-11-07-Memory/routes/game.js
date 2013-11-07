var mongoose = require('mongoose');
var Game = mongoose.model('Game');
var _ = require('lodash');

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
  // create array
  console.log("req.body.numPairs");
  console.log(req.body.numPairs);
  var gameboardArray = createGameBoardArray(req.body.numPairs);
  req.body.gameBoard = gameboardArray
console.log('in create ...' +req.body.gameBoard);
  // new Game(newData);
  new Game(req.body).save(function(err, game){
    game.gameBoard = null;
    res.send(game);
    //check that we are returning a proper array
    //in gameBoard property in browser.
  });
};

function createGameBoardArray(numPairs){
  // Creates an array of size 2n containing pairs of values in random order
  var array = [];
  var intPairs = parseInt(numPairs);
  var array2 = (_.range(1, (intPairs+1)));
  var array3 = (_.range(1, (intPairs+1)));
  array = array2.concat(array3);
  array = _.shuffle(array);
  return array;
}
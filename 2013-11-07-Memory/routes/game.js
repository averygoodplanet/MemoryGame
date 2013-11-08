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

/*
 * GET /click
 */

exports.click = function(req, res){
  //req.query has cardLocation
  console.log('req.query');
  console.log(req.query);

  // find current game by id
  Game.findById(req.query.gameid, function(err, game){
    // within that game, go to position 'cardLocation'
    // and get value (property = gameBoard)
    // send retrieved value back to browser
    res.send({value: game.gameBoard[req.query.cardLocation]});
  });
};

// POST /new
exports.create = function(req, res){
  // create array
  var gameboardArray = createGameBoardArray(req.body.numPairs);
  req.body.gameBoard = gameboardArray
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

/*
 * POST /end
 */

exports.end = function(req, res){
  var endTime = Date.now();

  // find the game by id
  Game.findById(req.body.gameid, function(err, game){
    var timeInSeconds = ((endTime - game.startTime) / 1000).toFixed();
    Game.findByIdAndUpdate(req.body.gameid, {timeInSeconds: timeInSeconds}, function(err, game){
      console.log(game);
      res.send(game);
    });
  });
};
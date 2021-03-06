// bring in required files
var mongoose = require('mongoose');
var _ = require('lodash');

// define game model
var Game = mongoose.Schema({
  numPairs: Number,
  playerName: String,
  startTime: {type: Date, default: Date.now},
  timeInSeconds: Number,
  gameBoard: [Number]
});

mongoose.model('Game', Game);
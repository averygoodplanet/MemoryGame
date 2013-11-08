$(document).ready(initialize);

function initialize(){
  $(document).foundation();

  // submit handlers
  $('#userInput').on('submit', submitStartGame);
  $('#gameBoard').on('click', '.card', clickCard);
}

// --------------------------------------------------
// --------------------------------------------------
// --------------------------------------------------
// click handlers

function submitStartGame(e)
{

  // package the data for submission to database
  var url = $(this).attr('action');
  var numPairs = parseInt($('input[name=numberPairs]').val());
  var playerName = $('input[name=name]').val();
  var verb = $(this).attr('method');


  // call "send ajax data" function
  sendGenericAjaxRequest(url, {numPairs:numPairs, playerName:playerName}, verb, null, e, function(data, status, jqXHR){
    htmlDrawGameBoard(data);
  });

  // prevent default action

}

function clickCard(e) {
  //get card index of clicked card
  var $clickedCard = $(this);
  var cardLocation = $clickedCard.data('id');
  var gameid = $('#gameBoard').data('gameid');
  var cardValue = null;

  // If user clicked on a card that is already face up or a card that is matched (out-of-play), then exit this function.
  if($clickedCard.hasClass('faceUp') || $clickedCard.hasClass('matched'))
    return;

  //send cardLocation via ajax to server and get the card's hidden value back
  sendGenericAjaxRequest('/click', {cardLocation: cardLocation, gameid: gameid }, 'GET', null, e, function(card, status, jqXHR){
    cardValue = card.value;
    flipCardHandler($clickedCard, cardValue);
    if($('.faceUp').length > 1){
      matchingCardsHandler(e);
    }
  });
}

function flipCardHandler($clickedCard, cardValue) {
  // take action based on how many cards are .faceUp at time of the click
  switch($('.faceUp').length){
    case 0:
      htmlFlipCardUp($clickedCard, cardValue);
      break;
    case 1:
      htmlFlipCardUp($clickedCard, cardValue);
      break;
    case 2:
      htmlFlipCardsDown();
      htmlFlipCardUp($clickedCard, cardValue);
      break;
    default:
      alert('Error in app.js switch statement on $(".faceUp").length');
  }
}

function matchingCardsHandler(e) {
  var $faceUpCards = $('.faceUp');
  var faceUpCardValues = [];

  for(var i =0; i < 2; i++){
    faceUpCardValues.push(parseInt($faceUpCards[i].textContent));
  }

  var isMatch = ( faceUpCardValues[0] === faceUpCardValues[1] );

  if(isMatch){
    $faceUpCards.addClass('matched').removeClass('faceUp');
    var areAllCardsMatched = ($('.card').length === $('.matched').length);
    if(areAllCardsMatched){
      gameWrapUp(e);
    }
  }
}

function gameWrapUp(e) {
  // Contact the server (sending gameid) and have server save the game's duration (for stats in future)
  var gameid = $('#gameBoard').data('gameid');

  sendGenericAjaxRequest('/end', {gameid: gameid }, 'POST', null, e, function(game, status, jqXHR){
    console.log(game);
    // in call back:
    // Remove the cards from under the gameboard div
    $('#gameBoard').children().remove();
    // Remove game id from gameboard
    $('#gameBoard').attr('data-gameid', '');
    // Display message to user (e.g. it took them X amount of time to finish, congratulations; start a new game by filling in field)
    var displayString = "Congratulations, "+ game.playerName + " you finished matching the " + game.numPairs + " pairs in " + game.timeInSeconds + " seconds.  See upper right-hand corner to start a new game.";
    $('#goodLuck').text(displayString);
    // Show User Input field
    $('#userInput').show();
  });
}

//----------------------------------------------------------------------------//
//----------------------------------------------------------------------------//

function sendGenericAjaxRequest(url, data, verb, altVerb, event, successFn){
  var options = {};
  options.url = url;
  options.type = verb;
  options.data = data;
  options.success = successFn;
  options.error = function(jqXHR, status, error){console.log(error);};

  if(altVerb) options.data._method = altVerb;
  $.ajax(options);
  if(event) event.preventDefault();
}

// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// html functions

function htmlDrawGameBoard(game)
{
  $('#gameBoard').attr('data-gameid', game._id);
  $('#userInput input').val('');
  $('#userInput').hide();
  $('#goodLuck').text('Good luck, '+game.playerName);
  for (var i=0; i< (game.numPairs * 2); i++)
  {
    $td = $('<div>');
    $td.addClass('card', 'unmatched');
    $td.attr('data-id', i);
    $('#gameBoard').append($td);
  }
}

function htmlFlipCardUp($clickedCard, cardValue)
{
  $clickedCard.text(cardValue);
  $clickedCard.addClass('faceUp');
}

function htmlFlipCardsDown(){
  $('.faceUp').text('');
  $('.faceUp').removeClass('faceUp');
}
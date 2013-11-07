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
  var cardLocation = $(this).data('id');
  var gameid = $('#gameBoard').data('gameid');
  alert(gameid);
  //send cardLocation via ajax to server and get the card's hidden value back
  sendGenericAjaxRequest('/click', {cardLocation: cardLocation, gameid: gameid }, 'GET', null, e, function(data, status, jqXHR){
    console.log(data);
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
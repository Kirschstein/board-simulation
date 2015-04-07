'use strict';

function Board() {
	var ticketsCreated = 0;
	var result = {
	    backlog : [],
   	  devInProgress : [],
    	devDone : [],
    	testInProgress : [],
      testDone : [],
    	live : [] ,
	};

	result.addStory = function(v, dev, qa) {
      ticketsCreated++;
      var options = {
      	value : v,
      	devCost : dev,
      	qaCost : qa,
  		  board : result,
  		  id : ticketsCreated
      };
      var story = new Story(options);
	    result.backlog.push(story);
	};

	result.addBug = function(ticket) {
		ticket.hasBug = function() { return true;}
    var halfQaCost = ((ticket.value + 1) / 2) | 0;
    var halfDevCost = ticket.value + 1;
		result.backlog.unshift(new Bug(0, halfDevCost, halfQaCost, result, ticket));
	};

  result.newDay = function() {
    ticketHasBeenPushedToday = false;
    for (var i = 0; i < 3; i++) {
      if (result.devInProgress[i]) {
        if (result.devInProgress[i].devCompletedYesterday) {
          result.devInProgress[i].canPullFromDev = true;
        }
        result.devInProgress[i].devCompletedYesterday = result.devInProgress[i].devCost == 0;
      }      
    }
  };

  var ticketHasBeenPushedToday = false;

  result.canPullFromDevInProgress = function (index) {
    if (ticketHasBeenPushedToday) {
      return false;
    }

    if (result.devInProgress[index]){
      return result.devInProgress[index].canPullFromDev || false;
    }
    return false;
  };

  result.devDone.pull = function(index) {
    var ticket = result.devInProgress[index];
    ticket.isReady = function () { return false;};
    result.devInProgress.splice(index, 1);
    result.devDone.push(ticket);
  };

  result.ticketPushed = function() {
    ticketHasBeenPushedToday = true;
  };

 	return result;
}
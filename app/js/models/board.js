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
		result.backlog.unshift(new Bug(0, 1, 1, result, ticket));
	};

  var canPullFromDev = false;

  result.newDay = function() {
    if (result.devInProgress[0]) {
      if (result.devInProgress[0].devCompletedYesterday) {
        canPullFromDev = true;
      }
      result.devInProgress[0].devCompletedYesterday = result.devInProgress[0].devCost == 0;
    }
  };

  result.canPullFromDevInProgress = function () {
    return canPullFromDev;
  };

 	return result;
}
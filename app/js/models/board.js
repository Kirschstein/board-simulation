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

  result.newDay = function() {
    for (var i = 0; i < 3; i++) {
      if (result.devInProgress[i]) {
        if (result.devInProgress[i].devCompletedYesterday) {
          result.devInProgress[i].canPullFromDev = true;
        }
        result.devInProgress[i].devCompletedYesterday = result.devInProgress[i].devCost == 0;
      }      
    }
  };

  result.canPullFromDevInProgress = function (index) {
    return result.devInProgress[index].canPullFromDev || false;
  };

 	return result;
}
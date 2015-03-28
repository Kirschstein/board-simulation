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
		result.backlog.push(new Bug(0, 1, 1, result, ticket));
	};

	return result;
}
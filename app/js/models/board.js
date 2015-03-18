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

	result.backlog.addStory = function(v, dev, qa) {
      var story = new Story(v,dev,qa,result);
      ticketsCreated++;
      story.id = ticketsCreated;
	  this.push(story);
	};

	result.backlog.addBug = function() {
	  this.push(new Bug(0, 0, 1, result));
	};

	result.addStory = function(v, dev, qa) {
		result.backlog.addStory(v, dev, qa);
	};

	return result;
}
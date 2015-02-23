'use strict';

function Board() {
	var result = {
		backlog : [],
     	devInProgress : [],
      	devDone : [],
      	testInProgress : [],
        testDone : [],
      	live : [] ,
	};

	result.backlog.addStory = function(v, dev, qa) {
	  this.push(new Story(v, dev, qa, result));
	};

	result.backlog.addBug = function() {
	  this.push(new Bug(0, 0, 1, result));
	};

	return result;
}
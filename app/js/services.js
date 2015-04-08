'use strict';
var boardServices = angular.module('boardServices', []);

boardServices.service('Random', function() {

	// stole this from the interwebs.
	Math.seed = 1234567;
	Math.bugSeed = 234567;
	 
	// in order to work 'Math.seed' must NOT be undefined,
	// so in any case, you HAVE to provide a Math.seed
	Math.seededRandom = function(max, min) {
	    max = max || 1;
	    min = min || 0;
	 
	    Math.seed = (Math.seed * 9301 + 49297) % 233280;
	    var rnd = Math.seed / 233280;
	 
	    return min + rnd * (max - min);
	}

	this.nextRandom = function(max, min) {
		return Math.floor(Math.seededRandom(max, min));
	};

	this.nextBugRandom = function(max, min) {
	    max = max || 1;
	    min = min || 0;
	 
	    Math.bugSeed = (Math.bugSeed * 9301 + 49297) % 233280;
	    var rnd = Math.bugSeed / 233280;
	 
	 	var result = min + rnd * (max - min)
	    return Math.floor(result) ;
	}
});

boardServices.service('BugFactory', function(Random) {

	this.processTicket = function(ticket, board) {
		var nextRandom = Random.nextBugRandom(1,3);
		if (nextRandom === 1) {
			board.addBug(ticket);
		}
	};
});
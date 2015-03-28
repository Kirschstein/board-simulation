'use strict';

/* App Module */

var boardApp = angular.module('boardSimulationApp', [
  'ngRoute',
  'boardControllers',
  'boardServices',
]);

boardApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/board', {
        templateUrl: 'partials/board.html',
        controller: 'BoardCtrl'
      }).
      otherwise({
        redirectTo: '/board'
      });
  }]);;'use strict';

var boardControllers = angular.module('boardControllers', []);

boardControllers.controller('BoardCtrl', ['$scope', 'Random', 'BugFactory',
  function($scope, Random, BugFactory) {
      var board = new Board();
      var analysts = new Analysts(board, Random);
      var testers = new Testers(board, Random, BugFactory);
      var developers = new Developers(board, Random);

      $scope.board = board;
      $scope.backlog = board.backlog;
      $scope.devInProgress = board.devInProgress;
      $scope.devDone = board.devDone;
      $scope.testInProgress = board.testInProgress;
      $scope.testDone = board.testDone;
      $scope.live = board.live;
      $scope.dayCount = 1;
      $scope.liveMetrics = new LiveMetrics(board);

      var newDayListeners = [
        analysts,
        developers,
        testers,
        $scope.liveMetrics
      ];    
  
      $scope.newDay = function() {
        for(var i=0; i < newDayListeners.length; i++) {
          newDayListeners[i].newDay();
        }
        $scope.dayCount++;
      };

      analysts.seedBoard();
  }]);;'use strict';

/* Directives */
;'use strict';

var boardControllers = angular.module('boardControllers');

boardControllers.value('Backlog', function() {});

var live = [];

live.cumulativeValue = 0;

live.newDay = function() {
	for (var i=0; i < live.length; ++i) {
		live.cumulativeValue += live[i].value;
	};
};

boardControllers.value('LiveColumn', live);;'use strict'

function Analysts(board, random) {

	function createNewUserStories(storiesToCreate) {
    	for(var i=0; i < storiesToCreate; ++i) {
           var value = random.nextRandom(7,1);
           var howManyDice = Math.ceil(value / 2);
           var devCost = random.nextRandom(7 * howManyDice, 1 * howManyDice);
           var qaCost = value + 1;
           board.addStory(value, devCost, qaCost);
		};
	};

	function seedBoard() {
      board.addStory(2,3,3);
      board.addStory(3,5,4);
      board.addStory(6,18,7);
      board.addStory(4,12,5);
	};

	return {
		newDay : function() {
			createNewUserStories(2);
		},
		seedBoard : seedBoard,
	}
};'use strict';

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
		result.backlog.push(new Bug(0, 0, 1, result, ticket));
	};

	return result;
};'use strict';

function Story(options) {
	var result = new Ticket(options.value, options.devCost, options.qaCost, options.board);
  result.id = options.id;
	result.type = 'story';
  result.process = function(board, bugFactory) {
                      bugFactory.processTicket(this, board);
                   };
	return result;
};

function Bug(value, devCost, qaCost, board, spawningTicket) {
	var result = new Ticket(value, devCost, qaCost, board);
	result.type = 'bug';
  result.process = function() {
                      spawningTicket.hasBug = function() { return false; } ;
                  };
	return result;
};


function Ticket(value, devCost, qaCost, board) {
	return {
		value : value,
        devCost : devCost,
        qaCost : qaCost,
        isReady : function() { return board.devInProgress.devCount > board.devInProgress.length;},
        hasBug : function() { return false;},
        push : function() { 
          var index = board.backlog.indexOf(this);
          if (index != -1) {
            board.devInProgress.add(this);
            board.backlog.splice(index, 1);
          }
        },
        devWork : function(amount) {
          this.devCost -= amount;
          if (this.devCost < 0) {
            this.devCost = 0;
          }
        },
        qaWork : function(amount) {
          var diff = amount - this.qaCost;
          this.qaCost -= amount;
          if (this.qaCost < 0) {
            this.qaCost = 0;
            return diff;    
          }      
        },
        process : function(board, bugFactory) {
          bugFactory.processTicket(this, board);
        },
	};
};

;'use strict';

function Developers(board, random) {
  board.devDone.pull = function() {
    board.testInProgress.push.apply(board.testInProgress, board.devDone );
    board.devDone.length = 0;
    board.devDone.isReady = function() { return false;};
  };

  board.devInProgress.devCount = 3;

  board.devDone.add = function(card) {
      this.push(card);
      card.isReady = function() { return false;}
      this.isReady = function() { return true;}
  };

  board.devInProgress.add = function(card) {
      this.push(card);
      card.isReady = function() {
          return this.devCost <= 0;
      };
      card.push = function() {
        var index = board.devInProgress.indexOf(this);
        if (index != -1) {
            board.devDone.add(this);
            board.devInProgress.splice(index, 1);
            board.testInProgress.excessCapacity = 0;
          }
      };
  };

  function doDevWork() {
     for (var i =0; i < board.devInProgress.length; ++i) {
      if (board.devInProgress[i]) {
        board.devInProgress[i].devWork(random.nextRandom(6,1));
      }
    };
  };

  return {
  	newDay : function() {
  		doDevWork();
  	},
  }

};;'use strict';

function LiveMetrics(board) {

	return {
		cumulativeValue : 0,
		newDay : function() {
			for (var i=0; i < board.live.length; ++i) {
				this.cumulativeValue += board.live[i].value;
			};		
		}
	};

};;'use strict';

function Testers(board, random, bugFactory) {

  board.testDone.isReady = function() { 
    
    for (var i=0; i < board.testDone.length; i++) {
      if (board.testDone[i].hasBug()) {
          return false;
      }
    }

  	return board.testInProgress.length == 0 && board.testDone.length > 0;
  }

  board.testDone.pull = function() { 
    board.live.push.apply(board.live, board.testDone );
    board.testDone.length = 0;
  }

  board.testInProgress.excessCapacity = 0;

  board.testInProgress.showExcessCapacity = function() {
    return board.testInProgress.excessCapacity > 0;
  };

  board.testInProgress.canUseExcessCapacity = function() {
    return board.testInProgress.showExcessCapacity() && board.devDone.length > 0;
  };

  board.testInProgress.useExcessCapacity = function() {
    board.devDone.pull();
    var excess = board.testInProgress.excessCapacity;
    board.testInProgress.excessCapacity = 0;
    doTestWork(excess);
  };
  
  function doTestWork(amount) {
	  if (board.testInProgress[0]) {
	    var diff = board.testInProgress[0].qaWork(amount);
	    if (board.testInProgress[0].qaCost === 0) {
	        var finishedTicket = board.testInProgress[0];
          finishedTicket.process(board, bugFactory);
	        board.testDone.push(finishedTicket);
	        board.testInProgress.splice(0, 1);
	        if (diff > 0) {
	          doTestWork(diff);
	        }
	    }
	  }
	  else {
	    board.testInProgress.excessCapacity = amount;
	  }
  };

  return {
  	newDay : function() {
  		doTestWork(random.nextRandom(7,1));
  	}
  }
};'use strict';
var boardServices = angular.module('boardServices', []);

boardServices.service('Random', function() {

	// stole this from the interwebs.
	Math.seed = 1234567;
	 
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
});

boardServices.service('BugFactory', function(Random) {

	this.processTicket = function(ticket, board) {
		var nextRandom = Random.nextRandom(1,4);
		if (nextRandom === 1) {
			board.addBug(ticket);
		}
	};
});
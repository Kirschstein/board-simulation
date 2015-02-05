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

boardControllers.controller('BoardCtrl', ['$scope', 'Random', 'BugFactory', 'LiveColumn',
  function($scope, Random, BugFactory, LiveColumn) {
      LiveColumn = LiveColumn || []
      $scope.backlog = [];
      $scope.devInProgress = [];
      $scope.devDone = [];
      $scope.testInProgress = [];
      $scope.testDone = [];
      $scope.live = LiveColumn;
      $scope.dayCount = 1;

      $scope.testDone.isReady = function() { return $scope.testInProgress.length == 0 && $scope.testDone.length > 0;}
      $scope.testDone.pull = function() { 
        LiveColumn.push.apply(LiveColumn, $scope.testDone );
        $scope.testDone.length = 0;
      }


      $scope.testInProgress.excessCapacity = 0;

      $scope.testInProgress.showExcessCapacity = function() {
        return $scope.testInProgress.excessCapacity > 0;
      };

      $scope.testInProgress.canUseExcessCapacity = function() {
        return $scope.testInProgress.showExcessCapacity() && $scope.devDone.length > 0;
      };

      $scope.testInProgress.useExcessCapacity = function() {
        $scope.devDone.pull();
        var excess = $scope.testInProgress.excessCapacity;
        $scope.testInProgress.excessCapacity = 0;
        $scope.doTestWork(excess);
      };

      $scope.devDone.pull = function() {
        $scope.testInProgress.push.apply($scope.testInProgress, $scope.devDone );
        $scope.devDone.length = 0;
        $scope.devDone.isReady = function() { return false;};
      };

      $scope.devInProgress.devCount = 3;

      $scope.devDone.add = function(card) {
          this.push(card);
          card.isReady = function() { return false;}
          this.isReady = function() { return true;}
      };

      $scope.devInProgress.add = function(card) {
          this.push(card);
          card.isReady = function() {
              return this.devCost <= 0;
          };
          card.pull = function() {
            var index = $scope.devInProgress.indexOf(this);
            if (index != -1) {
                $scope.devDone.add(this);
                $scope.devInProgress.splice(index, 1);
                $scope.testInProgress.excessCapacity = 0;
              }
          };
      };

      $scope.backlog.add = function(v, dev, qa) {
          this.push({
            value : v,
            devCost : dev,
            qaCost : qa,
            type : 'story',     
            isReady : function() { return $scope.devInProgress.devCount > $scope.devInProgress.length;},
            pull : function() { 
              var index = $scope.backlog.indexOf(this);
              if (index != -1) {
                $scope.devInProgress.add(this);
                $scope.backlog.splice(index, 1);
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
          });
      };
      $scope.backlog.addBug = function() {
          this.push({
            value : 0,
            devCost : 1,
            qaCost : 1,
            type : 'bug',     
            isReady : function() { return $scope.devInProgress.devCount > $scope.devInProgress.length;},
            pull : function() { 
              var index = $scope.backlog.indexOf(this);
              if (index != -1) {
                $scope.devInProgress.add(this);
                $scope.backlog.splice(index, 1);
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
          });
      };

      $scope.doTestWork = function(amount) {
          if ($scope.testInProgress[0]) {
            var diff = $scope.testInProgress[0].qaWork(amount);
            if ($scope.testInProgress[0].qaCost === 0) {
                var finishedTicket = $scope.testInProgress[0];
                BugFactory.processTicket(finishedTicket, $scope.backlog);
                $scope.testDone.push(finishedTicket);
                $scope.testInProgress.splice(0, 1);
                if (diff > 0) {
                  $scope.doTestWork(diff);
                }
            }
          }
          else {
            $scope.testInProgress.excessCapacity = amount;
          }
      };

      $scope.newDay = function() {

        LiveColumn.newDay();

        for(var i=0; i < 2; ++i) {
           var value = Random.nextRandom(7,1);
           var dice = Math.ceil(value / 2);
           var devCost = Random.nextRandom(7 * dice, 1 * dice);
           var qaCost = Math.min(4, Math.max(2, value));
           $scope.backlog.add(value,devCost,qaCost);
        };

        for (var i =0; i < $scope.devInProgress.length; ++i) {
          if ($scope.devInProgress[i]) {
            $scope.devInProgress[i].devWork(Random.nextRandom(6,1));
          }
        };

        

          $scope.doTestWork(Random.nextRandom(7,1));
          $scope.dayCount++;
      };


      $scope.backlog.add(2,3,4);
      $scope.backlog.add(3,5,3);
      $scope.backlog.add(6,18,4);
      $scope.backlog.add(4,12,3);
  }]);
;'use strict';

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

boardControllers.value('LiveColumn', live);;'use strict';
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

	this.processTicket = function(ticket, backlog) {
		var nextRandom = Random.nextRandom(5,1);
		if (nextRandom === 1) {
			backlog.addBug();
		}
	};
});
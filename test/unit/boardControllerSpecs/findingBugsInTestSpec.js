'use strict';

describe('a board with one ticket in test about ready to be completed', function() {
	beforeEach(module('boardSimulationApp'));

	var scope, ctrl, workDone, bugFactory;

    beforeEach(inject(function($rootScope, $controller) {
	  workDone = 2;
      var random = {
      	nextRandom : function(high,low) {
      		return workDone;
      	}
      };

      bugFactory = function() {
      		this.getAnyBugs = function(ticket) {
				return 0;
			};
      };

      scope = $rootScope.$new();
      ctrl = $controller('BoardCtrl', {$scope: scope, Random : random, BugFactory : bugFactory});
    }), 'Set up dependencies');

    beforeEach(function() {
    	scope.backlog.length = 0;
    	var value = 1;
    	var devCost = 2;
    	var qaCost = 2;
    	scope.backlog.add(value, devCost, qaCost);
    	scope.backlog[0].pull();
    	scope.newDay();
    	scope.devInProgress[0].pull();
    	scope.devDone.pull();

    }, 'Get one ticket into test ready to be worked on by a QA');


	it('it creates a bug if we "roll a 1" after fininshing testing', function() {

		// what part of the code rolls the die?
		// where is the die held?
		// what goes on to create the bug?
		// where does the bug go?

		scope.newDay();
	});

	it('it does not create create a bug if we "roll" more than 1 after finishing testing', function() {
		// some other context
		scope.newDay();
	});

});
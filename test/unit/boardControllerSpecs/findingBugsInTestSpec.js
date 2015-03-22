'use strict';

describe('a board with one ticket in test about ready to be completed', function() {
	beforeEach(module('boardSimulationApp'));

	var scope, ctrl, randomResult;

    beforeEach(function() {
      module( function ($provide) {

      var random = {
        nextRandom : function(high,low) {
          return randomResult;
        }
      };
        $provide.value('Random', random);
      });
    });

    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('BoardCtrl', {$scope: scope});
    }), 'Set up dependencies');

    beforeEach(function() {
    	scope.backlog.length = 0;
    	var value = 1;
    	var devCost = 2;
    	var qaCost = 1;
    	scope.backlog.addStory(value, devCost, qaCost);
    	scope.backlog[0].pull();
    	scope.newDay();
    	scope.devInProgress[0].pull();
    	scope.devDone.pull();

    }, 'Get one ticket into test ready to be worked on by a QA');


	it('it creates a bug if we "roll a 1" after fininshing testing', function() {
    randomResult = 1;
		scope.newDay();
    expect(scope.backlog.length).toBe(5);
    expect(scope.backlog[4].type).toBe('bug');
	});

	it('it does not create create a bug if we "roll" more than 1 after finishing testing', function() {
    randomResult = 2;
    scope.newDay();
    expect(scope.backlog.length).toBe(4);
    expect(scope.backlog[3].type).toBe('story');
	});
  
});
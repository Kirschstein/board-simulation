'use strict';

describe('board controllers', function() {
  	beforeEach(module('boardSimulationApp'));

	var scope, ctrl, random, workDone;

    beforeEach(inject(function($rootScope, $controller) {
	  workDone = 2;
      random = {
      	nextRandom : function(high,low) {
      		return workDone;
      	}
      };

      scope = $rootScope.$new();
      ctrl = $controller('BoardCtrl', {$scope: scope, Random : random });
    }));

	describe('a BoardCtrl initial layout', function(){

	    it('includes a backlog queue', function() {
	    	expect(scope.backlog).toBeDefined();
	    });

		it('has the backlog populated with 4 tickets', function(){
			expect(scope.backlog.length).toBe(4);
		});

		it('is ready to pull tickets from backlog', function() {
			expect(scope.backlog[0].isReady()).toBe(true);
			expect(scope.backlog[1].isReady()).toBe(true);
			expect(scope.backlog[2].isReady()).toBe(true);
		});

	    it('includes a dev in progress queue', function() {
	    	expect(scope.devInProgress).toBeDefined();
	    });

	    it('includes a dev done queue', function() {
	    	expect(scope.devDone).toBeDefined();
	    });

	    it('includes a test in progress queue', function() {
	    	expect(scope.testInProgress).toBeDefined();
	    });

	    it('includes a test done queue', function() {
	    	expect(scope.testDone).toBeDefined();
	    });

	    it('includes a live column', function() {
	    	expect(scope.live).toBeDefined();
	    });

	});

});
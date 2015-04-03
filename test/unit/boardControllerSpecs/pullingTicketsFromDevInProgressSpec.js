describe('pulling work from devInProgress completed before the current day', function(){

  	beforeEach(module('boardSimulationApp'));

	var scope, ctrl, random, workDone;

    beforeEach (inject(function($rootScope, $controller) {
		workDone = 2;
      	random = {
      		nextRandom : function(high,low) {
      			return workDone;
      		}
      	};

      scope = $rootScope.$new();
      ctrl = $controller('BoardCtrl', {$scope: scope, Random : random });
    }));

    describe('has an item of work already completed in dev', function() {

    	it('a dev ticket finished that day cannot be pulled', function() {
    		scope.backlog[0].push();
    		scope.devInProgress[0].devCost = 2;

			scope.newDay();
			expect(scope.devInProgress[0].devCost).toBe(0); // ensure ticket was finished
			expect(scope.board.canPullFromDevInProgress()).toBe(false);
    	});

    	it('a dev ticket finished on a previous day can be pulled', function() {
    		scope.backlog[0].push();
    		scope.devInProgress[0].devCost = 2;

			scope.newDay(); // ticket completes this day
			scope.newDay();

			expect(scope.board.canPullFromDevInProgress()).toBe(true);
    	});
    });

});
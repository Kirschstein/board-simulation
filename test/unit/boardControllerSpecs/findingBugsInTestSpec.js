'use strict';

describe('a board with one ticket in test about ready to be completed', function() {
	beforeEach(module('boardSimulationApp'));

	var scope, ctrl, workDone;

    beforeEach(inject(function($rootScope, $controller) {
	  workDone = 2;
      var random = {
      	nextRandom : function(high,low) {
      		return workDone;
      	}
      };

      scope = $rootScope.$new();
      ctrl = $controller('BoardCtrl', {$scope: scope, Random : random });
    }));

	it('these are the things we are explictly checking for', function(){
		expect(true).toBe(true);
	});

});
'use strict';

describe('board controllers', function() {
  	beforeEach(module('phonecatApp'));

	describe('BoardCtrl', function(){
    	var scope, ctrl, $httpBackend;

	    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
	      $httpBackend = _$httpBackend_;
	      scope = $rootScope.$new();
	      ctrl = $controller('BoardCtrl', {$scope: scope});
	    }));

		it('populates the board with a couple of tickets', function(){
			expect(scope.backlogTickets).toBeDefined();
			expect(scope.backlogTickets.length).toBe(2);
		});
	});
});
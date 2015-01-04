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

	    it ('has a backlog queue', function() {
	    	expect(scope.backlog).toBeDefined();
	    });

	    it ('has a dev in progress queue', function() {
	    	expect(scope.devInProgress).toBeDefined();
	    });

		it('populates the board with a couple of tickets', function(){
			expect(scope.backlog.length).toBe(4);
		});

		it('can pull from backlog if there is a spare dev to pick up the card', function() {
			expect(scope.backlog[0].isReady()).toBe(true);
		});

		it('can pull from backlog if there is a spare dev to pick up the card', function() {
			scope.backlog[0].pull();
			scope.backlog[0].pull();
			scope.backlog[0].pull();

			expect(scope.backlog[0].isReady()).toBe(false);
		});
	});
});
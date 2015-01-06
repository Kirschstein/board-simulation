'use strict';

describe('board controllers', function() {
  	beforeEach(module('phonecatApp'));

	describe('BoardCtrl with three tickets in the backlog', function(){
    	var scope, ctrl, $httpBackend, random;

	    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
	      random = {
	      	nextRandom : function(low,high) {
	      		return 2;
	      	}
	      };

	      $httpBackend = _$httpBackend_;
	      scope = $rootScope.$new();
	      ctrl = $controller('BoardCtrl', {$scope: scope, Random : random });
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

		it('cannot pull from backlog if there is not a spare dev to pick up the card', function() {
			scope.backlog[0].pull();
			scope.backlog[0].pull();
			scope.backlog[0].pull();

			expect(scope.backlog[0].isReady()).toBe(false);
		});

		it('can work on tickets when we go to next day', function(){
			scope.backlog[0].pull();

			scope.newDay();

			expect(scope.devInProgress[0].devCost).toBe(1);
		});


		it('wont let a card go below 0 dev cost when working on it', function(){
			scope.backlog[0].pull();
			scope.newDay();
			scope.newDay();

			expect(scope.devInProgress[0].devCost).toBe(0);
		});

		it('allows us to pull finished dev tickets into dev done', function(){
			scope.backlog[0].pull();
			scope.newDay();
			scope.newDay();
			scope.devInProgress[0].pull();

			expect(scope.devDone.length).toBe(1);
		});
	});
});
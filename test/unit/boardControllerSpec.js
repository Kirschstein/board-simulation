'use strict';

describe('board controllers', function() {
  	beforeEach(module('phonecatApp'));

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


	describe('a basic BoardCtrl', function(){

	    it('has a backlog queue', function() {
	    	expect(scope.backlog).toBeDefined();
	    });

	    it('has a dev in progress queue', function() {
	    	expect(scope.devInProgress).toBeDefined();
	    });

	    it('has a dev done queue', function() {
	    	expect(scope.devDone).toBeDefined();
	    });

	    it('has a test in progress queue', function() {
	    	expect(scope.testInProgress).toBeDefined();
	    });

	    it('has a test done queue', function() {
	    	expect(scope.testDone).toBeDefined();
	    });

	    it('has a live column', function() {
	    	expect(scope.live).toBeDefined();
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

		it('adds new tickets to the backlog on a new day', function() {
			scope.newDay();

			expect(scope.backlog.length).toBe(6);
		});

		it('can work on tickets when we go to next day', function(){
			scope.backlog[0].pull();

			scope.newDay();

			expect(scope.devInProgress[0].devCost).toBe(1);
		});
	});

	describe('after completing work on a ticket in dev done', function() {

		beforeEach(function() {
			scope.backlog[0].pull();
			scope.newDay();
			scope.newDay();
		}, 'We pull one ticket into dev in progress and it is completed');

		it('wont let a card go below 0 dev cost when working on it', function(){
			expect(scope.devInProgress[0].devCost).toBe(0);
		});

		it('allows us to pull finished dev tickets into dev done', function(){
			scope.devInProgress[0].pull();

			expect(scope.devDone.length).toBe(1);
		});

		it('card does not show as ready after pushing into dev done', function() {
			scope.devInProgress[0].pull();

			expect(scope.devDone[0].isReady()).toBe(false);
		});

		it('dev done can be pulled if it has an item in it', function(){
			scope.devInProgress[0].pull();

			expect(scope.devDone.isReady()).toBe(true);
		});
	});

	describe('working on tickets in testInProgress', function() {

		beforeEach(function() {
			scope.backlog[0].pull();
			scope.backlog[0].pull();
			scope.newDay();
			scope.newDay();
			scope.devInProgress[0].pull();
			scope.devInProgress[0].pull();
		}, 'Complete two tickets and pull them into devDone');

		it('pulling dev done into test moves all of the tickets', function(){
			scope.devDone.pull();

			expect(scope.devDone.length).toBe(0);
			expect(scope.testInProgress.length).toBe(2);
		});

		it('pulling tickets from devDone hides the pull button', function() {
			scope.devDone.pull();
			expect(scope.devDone.isReady()).toBe(false);
		});

		it('working on a ticket in test in progress', function() {
			scope.devDone.pull();
			scope.newDay();

			expect(scope.testInProgress[0].qaCost).toBe(2);
		});

		it('tickets in test are only worked on if there is spare QA capacity', function(){
			scope.devDone.pull();
			scope.newDay();

			expect(scope.testInProgress[1].qaCost).toBe(5);
		});

		it('completed qa cards are immediately placed into test done', function(){
			scope.devDone.pull();
			scope.newDay();
			scope.newDay();
			scope.newDay();

			expect(scope.testDone.length).toBe(1);
			expect(scope.testDone[0].qaCost).toBe(0);
		});

		it('extra qa capacity is immediately spent on the next card', function(){
			scope.devDone.pull();
			scope.newDay();
			scope.newDay();
			scope.newDay();

			expect(scope.testInProgress[0].qaCost).toBe(3);
		});

		it('test can be pushed to live when all testing is done on the cards', function(){
			scope.devDone.pull();

			scope.newDay();
			scope.newDay();
			scope.newDay();
			scope.newDay();
			scope.newDay();

			expect(scope.testInProgress.length).toBe(0);
			expect(scope.testDone.isReady()).toBe(true);
		});


		it('pushing test to live empties test and puts cards in live', function(){
			scope.devDone.pull();

			scope.newDay();
			scope.newDay();
			scope.newDay();
			scope.newDay();
			scope.newDay();

			scope.testDone.pull();

			expect(scope.testDone.length).toBe(0);
			expect(scope.live.length).toBe(2);
		});


	});
});
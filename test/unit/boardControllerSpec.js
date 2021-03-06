'use strict';

describe('board controllers', function() {
  	beforeEach(module('boardSimulationApp'));

	var scope, ctrl, random, workDone;

    beforeEach (inject(function($rootScope, $controller) {
    	workDone = 2;
      random = {
      	nextRandom : function(high,low) {
      		return workDone;
      	},
      	nextBugRandom : function(high,low) {
      		return workDone;
      	}
      };

      scope = $rootScope.$new();
      ctrl = $controller('BoardCtrl', {$scope: scope, Random : random });
    }));

    describe('misc', function() {
		it('keeps a cumulative total of value released to live (per day)', function(){
			scope.live.push({
				value :2
			});

			scope.newDay();

			scope.live.push({
				value : 3
			});

			scope.newDay();

			expect(scope.liveMetrics.cumulativeValue).toBe((2 * 2) + 3);
		});
    });

	describe('pulling tickets from the backlog', function(){

		it('cannot push from backlog if there is not a spare dev to pick up the card', function() {
			scope.backlog[0].push();
			scope.backlog[0].push();
			scope.backlog[0].push();

			expect(scope.backlog[0].isReady()).toBe(false);
		});

		it('adds 2 new tickets to the backlog on a new day', function() {
			scope.newDay();

			expect(scope.backlog.length).toBe(6);
		});

		it('the tickets added to the backlog on a new day have a type of "story"', function() {
			scope.newDay();
			expect(scope.backlog[4].type).toBe('story');
		});

		it('can work on tickets when we go to next day', function(){
			scope.backlog[0].push();

			scope.newDay();

			expect(scope.devInProgress[0].devCost).toBe(4);
		});
	});

	describe('working on tickets in the dev columns', function() {

		beforeEach(function() {
			scope.backlog[0].push();
			scope.newDay();
			scope.newDay();
			scope.newDay();
		}, 'We push one ticket into dev in progress and it is completed');

		it('wont let a card go below 0 dev cost when working on it', function(){
			expect(scope.devInProgress[0].devCost).toBe(0);
		});

		it('allows us to push finished dev tickets into dev done', function(){
			scope.devInProgress[0].push();

			expect(scope.devDone.length).toBe(1);
		});

		it('card does not show as ready after pushing into dev done', function() {
			scope.devInProgress[0].push();

			expect(scope.devDone[0].isReady()).toBe(false);
		});

		it('dev done can be pushed into test if it has an item in it', function(){
			scope.devInProgress[0].push();

			expect(scope.devDone.isReady()).toBe(true);
		});
	});

	describe('working on tickets in testInProgress', function() {

		beforeEach(function() {
			scope.backlog.length = 0;

			scope.board.addStory(2,3,4);
			scope.board.addStory(4,3,5);
			scope.board.addStory(4,3,5);

			scope.backlog[0].push();
			scope.backlog[0].push();
			scope.backlog[0].push();
			scope.newDay();
			scope.newDay();
			scope.devInProgress[0].push();
			scope.devInProgress[0].push();
		}, 'Complete two tickets and push them into devDone');

		it('pulling dev done into test moves all of the tickets', function(){
			scope.devDone.pushToTest();

			expect(scope.devDone.length).toBe(0);
			expect(scope.testInProgress.length).toBe(2);
		});

		it('pulling tickets from devDone hides the pull button', function() {
			scope.devDone.pushToTest();
			expect(scope.devDone.isReady()).toBe(false);
		});

		it('pulled tickets do not have a bug on by default', function() {
			scope.devDone.pushToTest();
			expect(scope.testInProgress[0].hasBug()).toBe(false);
		});

		it('a ticket worked on in test has its qaCost reduced', function() {
			scope.devDone.pushToTest();
			scope.newDay();

			expect(scope.testInProgress[0].qaCost).toBe(2);
		});

		it('tickets in test are only worked on if there is spare QA capacity', function(){
			scope.devDone.pushToTest();
			scope.newDay();

			expect(scope.testInProgress[1].qaCost).toBe(5);
		});

		it('completed qa cards are immediately placed into test done', function(){
			scope.devDone.pushToTest();
			scope.newDay();
			scope.newDay();

			expect(scope.testDone.length).toBe(1);
			expect(scope.testDone[0].qaCost).toBe(0);
		});

		it('extra qa capacity is immediately spent on the next card', function(){
			scope.devDone.pushToTest();
			workDone = 6;
			scope.newDay();

			expect(scope.testInProgress[0].qaCost).toBe(3);
		});

		it('shows excess capacity not used in test', function() {
			scope.devDone.pushToTest();

			scope.newDay();
			scope.newDay();

			var excess = 2;
			workDone = scope.testInProgress[0].qaCost + excess;

			scope.newDay();

			expect(scope.testInProgress.showExcessCapacity()).toBe(true);
			expect(scope.testInProgress.excessCapacity).toBe(excess);
		});

		it('allows excess qa capacity to be used on tickets in devDone', function(){
			scope.devDone.pushToTest();
			scope.devInProgress[0].push();
			
			scope.newDay();
			scope.newDay();

			var excess = 2;
			workDone = scope.testInProgress[0].qaCost + excess;

			scope.newDay();

			expect(scope.testInProgress.canUseExcessCapacity()).toBe(true);
		});

		it('using excess capacity pulls tickets into dev done and reduces their qaCost remaining', function() {
			scope.devDone.pushToTest();
			scope.devInProgress[0].push();
			
			scope.newDay();
			scope.newDay();

			var excess = 2;
			workDone = scope.testInProgress[0].qaCost + excess;

			scope.newDay();
			scope.testInProgress.useExcessCapacity();

			expect(scope.testInProgress.length).toBe(1);
			expect(scope.testInProgress[0].qaCost).toBe(3);
			expect(scope.testInProgress.excessCapacity).toBe(0);
			expect(scope.testInProgress.canUseExcessCapacity()).toBe(false);
		});

		it('excess qa capacity is lost when a ticket from dev in progress is pulled', function(){
			scope.devDone.pushToTest();
			scope.devInProgress[0].push();
			scope.board.addStory(2,3,2);
			scope.backlog[1].push();
			
			scope.newDay();
			scope.newDay();

			var excess = 2;
			workDone = scope.testInProgress[0].qaCost + excess;

			scope.newDay();
			scope.devInProgress[0].push();

			expect(scope.testInProgress.canUseExcessCapacity()).toBe(false);
			expect(scope.testInProgress.excessCapacity).toBe(0);
		});

		it('test can be pushed to live when all testing is done on the cards', function(){
			scope.devDone.pushToTest();

			scope.newDay();
			scope.newDay();
			scope.newDay();
			scope.newDay();
			scope.newDay();

			expect(scope.testInProgress.length).toBe(0);
			scope.testDone[0].hasBug = function() { return false;}
			scope.testDone[1].hasBug  = function() { return false;}
			expect(scope.testDone.isReady()).toBe(true);
		});

		it('pushing test to live empties test and puts cards in live', function(){
			scope.devDone.pushToTest();

			scope.newDay();
			scope.newDay();
			scope.newDay();
			scope.newDay();
			scope.newDay();

			scope.testDone.pull();

			expect(scope.testDone.length).toBe(0);
			expect(scope.live.length).toBe(2);
		});

		it('cannot push to live if a bug has been found in one of the tickets', function() {
			scope.devDone.pushToTest();

			scope.newDay();
			scope.newDay();
			scope.newDay();
			scope.newDay();
			scope.newDay();

			scope.testDone[0].hasBug = function() { return true;}

			expect(scope.testDone.isReady()).toBe(false);
		});
	});
});
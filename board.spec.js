var Board = require('./board.js');

describe('the board', function() {
	var theBoard

	beforeEach(function(){
	 	theBoard = new Board();
	});

	it ('has a list of columns', function() {
		expect(theBoard.columns).toContain('backlog');
		expect(theBoard.columns).toContain('dev-in-progress');
		expect(theBoard.columns).toContain('dev-done');
		expect(theBoard.columns).toContain('test-in-progress');
		expect(theBoard.columns).toContain('test-done');
		expect(theBoard.columns).toContain('live');
	});
});

describe('working from the backlog', function() {
	var theBoard

	beforeEach(function(){
	 	theBoard = new Board();
	});

	it('can add a ticket to the backlog', function() {
		theBoard.addTicket({});
		expect(theBoard['backlog'].length).toBe(1);
	});

	it('tickets on the backlog are always ready to pull', function(){
		theBoard.addTicket({id:1});
		expect(theBoard['backlog'][0].ready()).toBe(true);
	});

	it('can pull a ticket from backlog to dev in progress', function() {
		theBoard.addTicket({ id : 1});
		theBoard.pullTicket(1);
		expect(theBoard['dev-in-progress'].length).toBe(1);
		expect(theBoard['dev-in-progress'][0].id).toBe(1);
		expect(theBoard['backlog'].length).toBe(0);
	});
});

describe('working in dev-in-progress', function() {
	var theBoard

	beforeEach(function(){
	 	theBoard = new Board();
	});	

	it('tickets in dev-in-progress cannot immediately be pushed into dev-done', function(){
		theBoard.addTicket({id:1, devCost : 2});
		theBoard.pullTicket(1);
		expect(theBoard['dev-in-progress'][0].ready()).toBe(false);
	});	

	it('once a ticket in dev-in-progress has had all its worked completed it can be pushed into dev-done', function() {
		theBoard.addTicket({id:1, devCost : 2});
		theBoard.pullTicket(1);
		theBoard.devWorkOn(1, 2);
		theBoard.pullTicket(1);
		expect(theBoard['dev-in-progress'].length).toBe(0);
		expect(theBoard['dev-done'].length).toBe(1);
	});

	it('all dev completed work can be pulled into test-in-progress', function() {
		theBoard.addTicket({id:1, devCost : 2});
		theBoard.addTicket({id:2, devCost : 2});
		theBoard.pullTicket(1);
		theBoard.pullTicket(2);
		theBoard.devWorkOn(1,2);
		theBoard.devWorkOn(2,2);
		theBoard.pullTicket(1);
		theBoard.pullTicket(2);
		theBoard.pushFromDevDoneToTest();
		expect(theBoard['test-in-progress'].length).toBe(2);
		expect(theBoard['dev-done'].length).toBe(0);
	});
});

describe('working in test-in-progress', function() {
	var theBoard

	beforeEach(function(){
	 	theBoard = new Board();
	});	

	it('test completed work can be pulled into test-done', function() {
		theBoard.addTicket({id:1, devCost : 2, testCost : 1});
		theBoard.addTicket({id:2, devCost : 2, testCost : 2});
		theBoard.pullTicket(1);
		theBoard.pullTicket(2);
		theBoard.devWorkOn(1,2);
		theBoard.devWorkOn(2,2);
		theBoard.pullTicket(1);
		theBoard.pullTicket(2);
		theBoard.pushFromDevDoneToTest();
		theBoard.testWorkOn(1,1);
		expect(theBoard['test-in-progress'][0].ready()).toBe(true);
		expect(theBoard['test-in-progress'][1].ready()).toBe(false);
	});


});
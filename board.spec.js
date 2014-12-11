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

	it('tickets in dev-in-progress cannot be pulled immediately', function(){
		theBoard.addTicket({id:1, devCost : 2});
		theBoard.pullTicket(1);
		expect(theBoard['dev-in-progress'][0].ready()).toBe(false);
	});	

	it('once a ticket in dev-in-progress has had all its worked completed it can be pulled', function() {
		theBoard.addTicket({id:1, devCost : 2});
		theBoard.pullTicket(1);
		theBoard.devWorkOn(1, 2);
		theBoard.pullTicket(1);
		expect(theBoard['dev-in-progress'].length).toBe(0);
		expect(theBoard['dev-done'].length).toBe(1);
	});

	it('all dev completed work can be pushed into test-in-progress', function() {
		theBoard.addTicket({id:1, devCost : 2});
		theBoard.addTicket({id:2, devCost : 2});
		theBoard.pullTicket(1);
		theBoard.pullTicket(2);
		theBoard.devWorkOn(1,2);
		theBoard.devWorkOn(2,2);
		expect(theBoard.canPushToTestInProgess()).toBe(true);
	});


});
'use strict';

describe('adding bugs to the board', function() {
	var board, ticket;

	beforeEach(function() {
		board = new Board();
		ticket = new Story({
			value : 1,
			devCost : 1,
			qaCost : 1,
			id : 1,
			board : board
		});

		board.addBug(ticket);
	}, 'create a bug on the board found from a ticket');

	it('bugs the ticket associated with it', function() {
		expect(ticket.hasBug()).toBe(true);
	});	

	it('adds a bug to the backlog', function() {
		expect(board.backlog.length).toBe(1);
	});

});
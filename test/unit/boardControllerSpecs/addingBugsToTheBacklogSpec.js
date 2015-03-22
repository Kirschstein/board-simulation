'use strict';

describe('creating bugs on the backlog', function() {
	it('blocks the ticket associated with it', function() {
		var board = new Board();
		var ticket = new Story({
			value : 1,
			devCost : 1,
			qaCost : 1,
			id : 1,
			board : board
		});

		board.addBug(ticket);
		expect(ticket.isBlocked()).toBe(true);
	});	

});
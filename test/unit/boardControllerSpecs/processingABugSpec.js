describe('processing a bug', function() {
	it('unblocks the original ticket', function() {
		var board = new Board();
		var ticket = new Story({
			value : 1,
			devCost : 1,
			qaCost : 1,
			id : 1,
			board : board
		});


		board.addBug(ticket);

		var bugFactory = {
			processTicket : function(ticket, board) {

			},
		}
		board.backlog[0].process(board, bugFactory);

		expect(ticket.hasBug()).toBe(false);
	});
});
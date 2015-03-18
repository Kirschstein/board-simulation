
describe('the board', function() {

	it('adds a story to the backlog with a unique id', function() {
		var board = new Board();
		board.addStory(1,1,1);
		board.addStory(1,1,1);
		expect(board.backlog[0].id).toBe(1);
		expect(board.backlog[1].id).toBe(2);
	});
});
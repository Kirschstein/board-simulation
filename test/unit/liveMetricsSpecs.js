describe('live metrics', function() {

	it('keeps a track of released stories', function(){
		var board = new Board();
		var metrics = new LiveMetrics(board);

		var aStory = new Story({
			value : 1,
			devCost : 1,
			qaCost : 1,
			board : board
		});

		board.live.push(aStory);
		metrics.newDay();

		expect(metrics.storiesReleased).toBe(1);
		expect(metrics.bugsReleased).toBe(0);
	});

	it('keeps a track of the value of the released stories', function() {
		var board = new Board();
		var metrics = new LiveMetrics(board);

		var story1 = new Story({
			value : 1,
			devCost : 1,
			qaCost : 1,
			board : board
		});

		var story2 = new Story({
			value : 2,
			devCost : 1,
			qaCost : 1,
			board : board
		});

		board.live.push(story1);
		board.live.push(story2);
		metrics.newDay();
		metrics.newDay();

		expect(metrics.storyValueReleased).toBe(3);
	});

	it('keeps a track of released bugs', function(){
		var board = new Board();
		var metrics = new LiveMetrics(board);

		var aStory = new Story({
			value : 1,
			devCost : 1,
			qaCost : 1,
			board : board
		});

		var aBug = new Bug(1, 1, 1, board, aStory);

		board.live.push(aBug);
		metrics.newDay();

		expect(metrics.storiesReleased).toBe(0);
		expect(metrics.bugsReleased).toBe(1);
	});
	
});
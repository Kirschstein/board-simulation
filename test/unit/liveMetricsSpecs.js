describe('live metrics', function() {
	it('keeps a track of released stories', function(){
		var board = new Board();
		var metrics = new LiveMetrics(board);

		metrics.newDay();

		expect(metrics.cumulativeValue).toBe(0);
		expect(metrics.storiesReleased).toBe(0);
		expect(metrics.bugsReleased).toBe(0);
	});
});
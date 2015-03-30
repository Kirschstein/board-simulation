'use strict';

function LiveMetrics(board) {

	return {
		cumulativeValue : 0,
		storiesReleased : 0,
		bugsReleased : 0,
		newDay : function() {
			for (var i=0; i < board.live.length; ++i) {
				this.cumulativeValue += board.live[i].value;
			};		
		}
	};

};
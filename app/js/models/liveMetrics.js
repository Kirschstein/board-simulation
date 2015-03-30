'use strict';

function LiveMetrics(board) {

	return {
		cumulativeValue : 0,
		storiesReleased : 0,
		bugsReleased : 0,
		newDay : function() {
			this.storiesReleased = 0;
			this.bugsReleased = 0;
			for (var i=0; i < board.live.length; ++i) {
				this.cumulativeValue += board.live[i].value;
				if (board.live[i].type == "story") {
					this.storiesReleased++;
				}
				if(board.live[i].type == "bug") {
					this.bugsReleased++;
				}
			};		
		}
	};

};
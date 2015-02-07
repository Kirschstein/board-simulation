'use strict';

function LiveMetrics(board) {

	return {
		cumulativeValue : 0,
		newDay : function() {
			for (var i=0; i < board.live.length; ++i) {
				this.cumulativeValue += board.live[i].value;
			};		
		}
	};

};
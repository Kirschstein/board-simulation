'use strict'

function Analysts(board, random) {

	function createNewUserStories() {
    	for(var i=0; i < 2; ++i) {
           var value = random.nextRandom(7,1);
           var howManyDice = Math.ceil(value / 2);
           var devCost = random.nextRandom(7 * howManyDice, 1 * howManyDice);
           var qaCost = Math.min(4, Math.max(2, value));
           board.backlog.push(new Story(value, devCost, qaCost, board));
		};
	};

	return {
		newDay : function() {
			createNewUserStories();
		},
	}
}
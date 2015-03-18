'use strict'

function Analysts(board, random) {

	function createNewUserStories(storiesToCreate) {
    	for(var i=0; i < storiesToCreate; ++i) {
           var value = random.nextRandom(7,1);
           var howManyDice = Math.ceil(value / 2);
           var devCost = random.nextRandom(7 * howManyDice, 1 * howManyDice);
           var qaCost = Math.min(4, Math.max(2, value));
           board.backlog.addStory(value, devCost, qaCost);
		};
	};

	function seedBoard() {
      board.backlog.addStory(2,3,4);
      board.backlog.addStory(3,5,3);
      board.backlog.addStory(6,18,4);
      board.backlog.addStory(4,12,3);
	};

	return {
		newDay : function() {
			createNewUserStories(2);
		},
		seedBoard : seedBoard,
	}
}
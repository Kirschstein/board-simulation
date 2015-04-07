'use strict'

function Analysts(board, random) {

	function createNewUserStories(storiesToCreate) {
    	for(var i=0; i < storiesToCreate; ++i) {
           var value = random.nextRandom(7,1);
           var howManyDice = Math.ceil(value / 2);
           var devCost = (value * 2) + 2;
           var qaCost = value + 1;
           board.addStory(value, devCost, qaCost);
		};
	};

	function seedBoard() {
		createNewUserStories(4);
	};

	return {
		newDay : function() {
			createNewUserStories(2);
		},
		seedBoard : seedBoard,
	}
}
'use strict'

function Analysts(board, random) {

	function createNewUserStories(storiesToCreate) {
    	for(var i=0; i < storiesToCreate; ++i) {
           var value = random.nextRandom(7,1);
           var howManyDice = Math.ceil(value / 2);
           var devCost = value + 3;
           var qaCost = value + 1;
           board.addStory(value, devCost, qaCost);
		};
	};

	function seedBoard() {
		createNewUserStories(4);
   //   board.addStory(2,3,3);
   //   board.addStory(3,5,4);
   //   board.addStory(6,18,7);
   //   board.addStory(4,12,5);
	};

	return {
		newDay : function() {
			createNewUserStories(2);
		},
		seedBoard : seedBoard,
	}
}
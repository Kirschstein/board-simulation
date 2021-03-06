'use strict';

function Testers(board, random, bugFactory) {

  board.testDone.isReady = function() { 
    
    for (var i=0; i < board.testDone.length; i++) {
      if (board.testDone[i].hasBug()) {
          return false;
      }
    }

  	return board.testInProgress.length == 0 && board.testDone.length > 0;
  }

  board.testDone.pull = function() { 
    board.live.push.apply(board.live, board.testDone );
    board.testDone.length = 0;
  }

  board.testInProgress.excessCapacity = 0;

  board.testInProgress.showExcessCapacity = function() {
    return board.testInProgress.excessCapacity > 0;
  };

  board.testInProgress.canUseExcessCapacity = function() {
    return board.testInProgress.showExcessCapacity() && board.devDone.length > 0;
  };

  board.testInProgress.useExcessCapacity = function() {
    board.devDone.pushToTest();
    var excess = board.testInProgress.excessCapacity;
    board.testInProgress.excessCapacity = 0;
    doTestWork(excess);
  };
  
  function doTestWork(amount) {
	  if (board.testInProgress[0]) {
	    var diff = board.testInProgress[0].qaWork(amount);
	    if (board.testInProgress[0].qaCost === 0) {
	        var finishedTicket = board.testInProgress[0];
          finishedTicket.process(board, bugFactory);
	        board.testDone.push(finishedTicket);
	        board.testInProgress.splice(0, 1);
	        if (diff > 0) {
	          doTestWork(diff);
	        }
	    }
	  }
	  else {
	    board.testInProgress.excessCapacity = amount;
	  }
  };

  return {
  	newDay : function() {
  		doTestWork(random.nextRandom(7,1));
  	}
  }
}
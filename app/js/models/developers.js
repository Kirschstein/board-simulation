'use strict';

function Developers(board, random) {

  board.devDone.pushToTest = function() {
    board.testInProgress.push.apply(board.testInProgress, board.devDone );
    board.devDone.length = 0;
    board.devDone.isReady = function() { return false;};
  };

  board.devInProgress.devCount = 3;

  board.devDone.add = function(card) {
      this.push(card);
      card.isReady = function() { return false;}
      this.isReady = function() { return true;}
  };

  board.devInProgress.add = function(card) {
      this.push(card);
      card.isReady = function() {
          return this.devCost <= 0;
      };
      card.push = function() {
        var index = board.devInProgress.indexOf(this);
        if (index != -1) {
            board.devDone.add(this);
            board.devInProgress.splice(index, 1);
            board.testInProgress.excessCapacity = 0;
          }
      };
  };

  function doDevWork() {
     for (var i =0; i < board.devInProgress.length; ++i) {
      if (board.devInProgress[i]) {
        board.devInProgress[i].devWork(random.nextRandom(6,1));
      }
    };
  };

  return {
  	newDay : function() {
  		doDevWork();
  	},
  }

};
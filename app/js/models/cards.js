'use strict';

function Story(value, devCost, qaCost, board) {
	var result = new Ticket(value, devCost, qaCost, board);
	result.type = 'story';
	return result;
};

function Bug(value, devCost, qaCost, board) {
	var result = new Ticket(value, devCost, qaCost, board);
	result.type = 'bug';
	return result;
};


function Ticket(value, devCost, qaCost, board) {
	return {
		value : value,
        devCost : devCost,
        qaCost : qaCost,
        isReady : function() { return board.devInProgress.devCount > board.devInProgress.length;},
        pull : function() { 
          var index = board.backlog.indexOf(this);
          if (index != -1) {
            board.devInProgress.add(this);
            board.backlog.splice(index, 1);
          }
        },
        devWork : function(amount) {
          this.devCost -= amount;
          if (this.devCost < 0) {
            this.devCost = 0;
          }
        },
        qaWork : function(amount) {
          var diff = amount - this.qaCost;
          this.qaCost -= amount;
          if (this.qaCost < 0) {
            this.qaCost = 0;
            return diff;    
          }      
        },
	};
}


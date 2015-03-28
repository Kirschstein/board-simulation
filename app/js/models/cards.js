'use strict';

function Story(options) {
	var result = new Ticket(options.value, options.devCost, options.qaCost, options.board);
  result.id = options.id;
	result.type = 'story';
  result.process = function(board, bugFactory) {
                      bugFactory.processTicket(this, board);
                   };
	return result;
};

function Bug(value, devCost, qaCost, board, spawningTicket) {
	var result = new Ticket(value, devCost, qaCost, board);
	result.type = 'bug';
  result.process = function() {
                      spawningTicket.hasBug = function() { return false; } ;
                  };
	return result;
};


function Ticket(value, devCost, qaCost, board) {
	return {
		value : value,
        devCost : devCost,
        qaCost : qaCost,
        isReady : function() { return board.devInProgress.devCount > board.devInProgress.length;},
        hasBug : function() { return false;},
        pull : function() { 
          var index = board.backlog.indexOf(this);
          if (index != -1) {
            board.devInProgress.add(this);
            board.backlog.splice(index, 1);
          }
        },
        push : function() { 
          this.pull();
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
        process : function(board, bugFactory) {
          bugFactory.processTicket(this, board);
        },
	};
};


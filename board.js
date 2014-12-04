var _ = require('underscore')._;

module.exports = function Board() {
	this.columns = ['backlog', 
					'dev-in-progress', 
					'dev-done', 
					'test-in-progress', 
					'test-done', 
					'live'];

	this['backlog'] = [];
	this['dev-in-progress'] = [];
	this['dev-done'] = [];

	this.addTicket = function(ticket) {
		this['backlog'].push(ticket);
		ticket.ready = function() {
			return true;
		};
	};

	promoteFromBacklog = function(board, ticketId) {
		var toPromote = _.find(board['backlog'], function(t) { return t.id == ticketId;});
		if (toPromote == undefined)	return;
		toPromote.ready = function() {
			return this.devCost <= this.devWorkDone;
		};
		board['dev-in-progress'].push(toPromote);
		board['backlog'] = _.reject(board['backlog'], function(t) { return t.id == ticketId;});
	};

	promoteFromDevInProgress = function(board, ticketId) {
		var toPromote = _.find(board['dev-in-progress'], function(t) { return t.id == ticketId;});
		if (toPromote == undefined)	return;
		board['dev-done'].push(toPromote);
		board['dev-in-progress'] = _.reject(board['dev-in-progress'], function(t) { return t.id == ticketId;});
	};

	this.pullTicket = function(ticketId)	{
		promoteFromDevInProgress(this, ticketId);
		promoteFromBacklog(this, ticketId);
	}

	this.devWorkOn = function(ticketId, workDone){
		var ticket = _.find(this['dev-in-progress'], function(t) { return t.id == ticketId;});
		ticket.devWorkDone = ticket.devWorkDone || 0;
		ticket.devWorkDone += workDone;
	};

};
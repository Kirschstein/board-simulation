'use strict';

var boardControllers = angular.module('boardControllers');

boardControllers.value('Backlog', function() {});

var live = [];

live.cumulativeValue = 0;

live.newDay = function() {
	for (var i=0; i < live.length; ++i) {
		live.cumulativeValue += live[i].value;
	};
};

boardControllers.value('LiveColumn', live);
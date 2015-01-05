'use strict';

/* Services */

var phonecatServices = angular.module('phonecatServices', ['ngResource']);

phonecatServices.factory('Phone', ['$resource',
  function($resource){
    return $resource('phones/:phoneId.json', {}, {
      query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
    });
  }]);


var boardServices = angular.module('boardServices', []);

boardServices.service('Random', function() {
	this.nextRandom = function(low,high) {
		return 2;
	};
});
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


	// stole this from the interwebs.
	Math.seed = 6;
	 
	// in order to work 'Math.seed' must NOT be undefined,
	// so in any case, you HAVE to provide a Math.seed
	Math.seededRandom = function(max, min) {
	    max = max || 1;
	    min = min || 0;
	 
	    Math.seed = (Math.seed * 9301 + 49297) % 233280;
	    var rnd = Math.seed / 233280;
	 
	    return min + rnd * (max - min);
	}

	this.nextRandom = function(max, min) {
		return Math.floor(Math.seededRandom(max, min));
	};
});
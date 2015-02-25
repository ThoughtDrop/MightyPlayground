angular.module('thoughtdrop.geolocation', [])

.factory('Geolocation', function($http, $cordovaGeolocation) {

  var getPosition = function() {
    console.log('getPosition!');
    return $cordovaGeolocation.getCurrentPosition();
  }

  return {
    getPosition: getPosition,
  };
})

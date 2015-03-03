angular.module('thoughtdrop.geolocation', [])

.factory('Geolocation', function($http, $cordovaGeolocation) {
  var lastPosition;
  // Run function to get most current location.
  var getPosition = function() {
    var QlastPosition = $cordovaGeolocation.getCurrentPosition();
    return QlastPosition;
  }

  var unPromiseLocation = function(){
    getPosition().then(function(position){lastPosition = position});
    return lastPosition;
  }

  return {
    getPosition: getPosition,
    unPromiseLocation: unPromiseLocation,
    lastPosition: lastPosition
  };
})

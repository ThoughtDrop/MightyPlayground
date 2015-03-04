angular.module('thoughtdrop.geolocation', [])

.factory('Geolocation', function($http, $cordovaGeolocation) {
  var QlastPosition = "Error: run geolocate";
  var testing = '1';
  // Run function to get most current location.
  var getPosition = function() {
    console.log("WENT INTO GET POSITION");
    var QlastPosition = $cordovaGeolocation.getCurrentPosition();
    testing ='2';
    return QlastPosition;
  }

  return {
    getPosition: getPosition,
    QlastPosition: QlastPosition,
    testing: testing
  };
})

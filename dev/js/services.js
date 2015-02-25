angular.module('thoughtdrop.services', [])

.factory('Messages', function($http, $cordovaGeolocation) {

  var getMessages = function() {
    return $http({
      method: 'GET',
      url: //base
      '/api/messages/'
    })
    .then(function (resp) {
      console.log('Server resp to func call to getMessages: ', resp);  
      return resp.data;
    });
  };


  var findNearby = function() {
    var sendPosition = function(data) {
      return $http({
        method: 'POST',
        url: //base
        '/api/messages/nearby',
        data: JSON.stringify(data)
      })
      .then(function (resp) {
        console.log('Server resp to func call to findNearby: ', resp);  
        return resp.data;
      });
    };
    
    $cordovaGeolocation
    .getCurrentPosition()
    .then(function(position) {
      var coordinates = {};
      coordinates.lat = position.coords.latitude;
      coordinates.long = position.coords.longitude;
      sendPosition(coordinates);
      console.log('Messages factory sending coordinates to server: ', coordinates);
    });
  };

  return {
    getMessages: getMessages,
    //findNearby: findNearby
  };
})

.factory('Facebook', function($http){

  var storeUser = function(data) {
    console.log('final data before sending to db: ', JSON.stringify(data));

    var userInfo = {
      _id: data.phoneNumber,
      name: data.name,
      fbID: data.id,
      picture: data.picture
    }

    return $http({
      method: 'POST',
      url: //base
      '/api/auth/id',
      data: JSON.stringify(userInfo)
    })
    .then(function(resp) {
      console.log('Server resp to func call to storeUser: ', resp);
    });
  };

  return {
    storeUser: storeUser
  };
});
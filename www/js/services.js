angular.module('thoughtdrop.services', [])

.factory('Messages', function($http, $cordovaGeolocation) {

  var getMessages = function() {
    return $http({
      method: 'GET',
      url: '/api/messages/'
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  var findNearby = function() {
    var sendPosition = function(data) {
      return $http({
        method: 'POST',
        url: '/api/messages/nearby',
        data: JSON.stringify(data)
      })
      .then(function (resp) {
        console.log('Server resp to func call to findNearby', resp);  
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
    });
  };

  return {
    getMessages: getMessages,
    findNearby: findNearby
  };
})

.factory('Facebook', function($http){

  // var storeId = function(data) {
  //   console.log(data);
  //   return $http({
  //     method: 'POST',
  //     url: '/api/auth/id',
  //     data: data
  //   })
  //   .then(function(resp) {
  //     console.log("user id stored", resp);
  //   });
  // };

  // var updatePhone = function(data) {
  //   console.log('servcies data: ' + JSON.stringify(data));
  //   return $http({
  //     method: 'POST',
  //     url: '/api/auth/id',
  //     data: data
  //   })
  //   .then (function(resp) {
  //     console.log('userPhone is stored', resp);
  //   });
  // };

  // var userPhone = function(data) {
  //   console.log('server data: ' + (JSON.stringify(data)));
  //   return $http({
  //     method: 'POST',
  //     url: '/api/auth/id',
  //     data: data
  //   })
  //   .then(function(resp) {
  //     console.log("user id stored", resp);
  //   });
  // };

  var dataStorage = {};


  console.log(JSON.stringify(dataStorage));

  var keepInfo = function(data) {
    dataStorage.userData = data;
    console.log('keptData: ' + JSON.stringify(dataStorage.userData.data));
  }

  var storeUser = function(data) {
    console.log('stre data' + JSON.stringify(data));
    dataStorage.userData.data.phoneNumber = data.phoneNumber; 
    console.log('final data before db' + JSON.stringify(dataStorage.userData.data));

    return $http({
      method: 'POST',
      url: '/api/auth/id',
      data: dataStorage.userData.data
    })
    .then(function(resp) {
      console.log('stored!');
    })
  };

  var updatePhone = function(data) {
    dataStorage.userData.phoneNumber = data.phoneNumber;
    console.log(JSON.stringify(dataStorage.userData));
  };

  return {
    updatePhone: updatePhone,
    storeUser: storeUser,
    keepInfo: keepInfo
  };
});
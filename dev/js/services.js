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

  // var findNearby = function() {
  //   var sendPosition = function(data) {
  //     return $http({
  //       method: 'POST',
  //       url: //base
  //       '/api/messages/nearby',
  //       data: JSON.stringify(data)
  //     })
  //     .then(function (resp) {
  //       console.log('Server resp to func call to findNearby', resp);  
  //       return resp.data;
  //     });
  //   };
    
  //   $cordovaGeolocation
  //   .getCurrentPosition()
  //   .then(function(position) {
  //     var coordinates = {};
  //     coordinates.lat = position.coords.latitude;
  //     coordinates.long = position.coords.longitude;
  //     sendPosition(coordinates);
  //   });
  // };

  return {
    getMessages: getMessages,
    //findNearby: findNearby
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
    console.log('FB factory keepInfo triggered: ', JSON.stringify(dataStorage.userData.data));
  };

  var updatePhone = function(data) {
    dataStorage.userData.phoneNumber = data.phoneNumber;
    console.log('FB factory updatePhone triggered : ', JSON.stringify(dataStorage.userData));
  };

  var storeUser = function(data) {
    console.log('storeUser triggered: ', JSON.stringify(data));
    dataStorage.userData.data.phoneNumber = data.phoneNumber; 
    console.log('final data before sending to db: ', JSON.stringify(dataStorage.userData.data));

    return $http({
      method: 'POST',
      url: //base 
      '/api/auth/id',
      data: JSON.stringify(dataStorage.userData.data)
    })
    .then(function(resp) {
      console.log('Server resp to func call to storeUser: ', resp);
    });
  };

  return {
    updatePhone: updatePhone,
    storeUser: storeUser,
    keepInfo: keepInfo
  };
});
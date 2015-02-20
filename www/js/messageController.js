angular.module('starter.messageController', [])

.controller('messageController', function($scope, $timeout, $http, Messages, $cordovaGeolocation, $ionicModal) {
  
  $scope.message = {};
  $scope.message.text = '';

  $ionicModal.fromTemplateUrl('templates/tab-post.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalNewMessage = modal;
  });

  $scope.submit = function() {
    $cordovaGeolocation
    .getCurrentPosition()
    .then(function(position) {
      var lat = position.coords.latitude;
      var long = position.coords.longitude;
      $scope.sendMessage($scope.message.text, long, lat);
    })
    .then(function() {
      $scope.findNearby();
    });
  
    $timeout(function() {
      $scope.closeMessageBox();
    }, 500);
  };

  $scope.closeMessageBox = function() {
    $scope.modalNewMessage.hide();
  };

  $scope.newMessage = function() {
    console.log('hey');
    $scope.modalNewMessage.show();
  };

  $scope.sendMessage = function(message, long, lat) {

    var data = {};
    data.message = message;
    data.long = long;
    data.lat = lat;

    console.log('sending data! ' + data.message);
    return $http({
      method: 'POST',
      url: '/api/messages',
      data: JSON.stringify(data)
    })
    .then(function(resp) {
      console.log('send message successful!');
      console.log(resp);
      return resp;
    })
    .catch(function(err) {
      console.log(err);
    });
  };

  $scope.findNearby = function() {
    var sendPosition = function(data) {
        return $http({
          method: 'POST',
          url: '/api/messages/nearby',
          data: JSON.stringify(data)
        })
        .then(function (resp) {
          console.log('Server resp to func call to findNearby', resp);  
          $scope.message.messages = resp.data;
          // $scope.apply();
          // return resp.data;
        });
      };
    
    $cordovaGeolocation
    .getCurrentPosition()
    .then(function(position) {
      var coordinates = {};
      coordinates.lat = position.coords.latitude;
      coordinates.long = position.coords.longitude;
      //console.log(coordinates);
      sendPosition(coordinates);
    });
   
    console.log('invoke services/findnearby');
  };

  // TODO - take another look at this to modularize all http requests to services. for some reason getNearby worked
  // but the .then in Messages.findNearby() was causing errors.
  
  //   Messages.findNearby() 
  //   .then(function(data) {
  //     $scope.message.messages = data;
  //   });
  // };


  //TODO - remove soon in favor of getNearby above?
  // $scope.getAll = function() {
  //   Messages.getMessages() 
  //   .then(function(data) {
  //     $scope.message.messages = data;
  //   });
  // };

  $scope.findNearby();
});
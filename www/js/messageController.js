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
      $scope.getAll();
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
      return resp.data;
    })
    .catch(function(err) {
      console.log(err);
    });
  };

  $scope.getNearby = function() {
    Messages.findNearby();
    // .then(function(data) {
    //   console.log('ALL NEAR MESSAGES', data);
    //   $scope.message.messages = data;
    // });
  };


  //TODO - remove soon in favor of getNearby above?
  // $scope.getAll = function() {
  //   Messages.getMessages() 
  //   .then(function(data) {
  //     $scope.message.messages = data;
  //   });
  // };

  $scope.getNearby();
});
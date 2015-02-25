angular.module('thoughtdrop.privateController', [])

.controller('privateController', function($scope, $timeout, $ionicModal, Private, Geolocation) {
  //TODO: change 'findNearby' to 'findNearbyMessages' (more intuitive)
        //limit number of times user can upvote and downvote to one per message
        //modularize all http requests to services
        //look into using socket.io to handle simultaneous upvote/downvote requests from clients
  $scope.message = {};
  $scope.message.text = '';
  $scope.page = 'new';
  $scope.message.isPrivate = true;


  $ionicModal.fromTemplateUrl('templates/tab-post.html', {
    scope: $scope
  }).then(function(modal) {
  $scope.modalNewMessage = modal;
  });

  $scope.setPage = function(page) {
    $scope.page = page;
  };

  $scope.sendMessage = function(route) {
    console.log('sendMessage!');
    $scope.closeMessageBox();

    Geolocation.getPosition()
      .then(function(position) {

        var data = {
          long: position.coords.longitude, 
          lat: position.coords.latitude,
          message: $scope.message.text,
        };

        // var data = [{lat: position.coords.latitude, long: position.coords.longitude}, $scope.message.text, isPrivate: true];

        $scope.message.text = '';

        Private.sendData('private', data)
        .then(function(resp) {
          console.log('Message ' + "'" + resp + "'" + ' was successfully posted to server');
          //return resp;
        })
        .catch(function(err) {
          console.log('Error posting message: ',  err);
        });
      })
      .then(function() {
        // $scope.findNearby('nearby');
      })
  };

  $scope.closeMessageBox = function(time) {
    var time = time || 250;
    $timeout(function() {
      $scope.modalNewMessage.hide();
    }, time);
  };

  $scope.newMessage = function() {
    $scope.modalNewMessage.show();
  };

});
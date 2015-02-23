angular.module('thoughtdrop.messageController', [])

.controller('messageController', function($scope, $timeout, $http, Messages, $cordovaGeolocation, $ionicModal) {
  //TODO: change 'findNearby' to 'findNearbyMessages' (more intuitive)
        //limit number of times user can upvote and downvote to one per message
        //modularize all http requests to services
  $scope.message = {};
  $scope.message.text = '';

  $ionicModal.fromTemplateUrl('templates/tab-post.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalNewMessage = modal;
  });

  $scope.sortFeed = function(action) {
    console.log('sorting feed by ' + "'" + action + "' messages");
    return $http({
       method: 'POST',
       url: '/api/messages/filterfeed',
       data: JSON.stringify(action)
     })
  };

  $scope.sendVote = function(messageID, voteCount) {
    console.log('Sending vote of: ' + voteCount + ' to server!');
    var data = {};
    data.messageID = messageID;
    data.voteCount = voteCount;

  return $http({
     method: 'POST',
     url: //base
     '/api/messages/votes',
     data: JSON.stringify(data)
   });
  };

  $scope.vote = function(messageID, voteCount, className) {
    console.log('All Messages', $scope.message.messages);
    
    if (className === 'upVote') {
      //Increment vote count in the DOM
      $scope.message.messages.forEach(function(message) {
        if (message._id === messageID) {
          //incrment count in DOM
          message.votes++;
          //send incremented count along with messageID to server
          console.log('upVOTING and changing vote to: ' + message.votes);
          $scope.sendVote(messageID, message.votes);
        }
      });
     
    } else if (className === 'downVote') {
      //Decrement vote count in the DOM
      $scope.message.messages.forEach(function(message) {
        if (message._id === messageID) {
          //decrement count in DOM
          message.votes--;
          //send decremented count along with messageID to server
          console.log('downVOTING and changing vote to: ' + message.votes);
          $scope.sendVote(messageID, message.votes);
        }
      });
    }
  };

  $scope.submit = function() {
    $cordovaGeolocation
    .getCurrentPosition()
    .then(function(position) {
      var lat = position.coords.latitude;
      var long = position.coords.longitude;
      $scope.sendMessage($scope.message.text, long, lat);
      $scope.message.text = '';
    })
    .then(function() {

      $scope.findNearby('nearby');
    });
  
    $timeout(function() {
      $scope.closeMessageBox();
    }, 500);
  };

  $scope.closeMessageBox = function() {
    $scope.modalNewMessage.hide();
  };

  $scope.newMessage = function() {
    $scope.modalNewMessage.show();
  };

  $scope.sendMessage = function(message, long, lat) {
    $scope.sendData(null, message, long, lat)

      .then(function(resp) {
        console.log('Message ' + "'" + message + "'" + ' was successfully posted to server');
        return resp;
      })
      .catch(function(err) {
        console.log('Error posting message: ',  err);
      });
  };


  $scope.sendData = function(route) {
    var data = Array.prototype.slice.call(arguments, 1);
    var route = route || "";
    //returns a promise that will be used to resolve/ do work on the data returned by the server
    return $http({
      method: 'POST',
      url:  //base
      '/api/messages/' + route,
      data: JSON.stringify(data)
    })
  };

  $scope.displayMessages = function(route, coordinates) {
    $scope.sendData(route, coordinates)
      .then(function (resp) {
        //populate scope with all messages within 100m of user
        console.log('Received ' + resp.data.length + ' messages within 100m of '+ JSON.stringify(coordinates) + ' from server:', resp.data);
        $scope.message.messages = resp.data;
      });    
  };

  $scope.getPosition = function() {
    return $cordovaGeolocation
              .getCurrentPosition()    
  };

  $scope.findNearby = function(route) {
    $scope.getPosition()
    .then(function(position) {
      //TODO: Just send the position and access the coordinates server side
      var coordinates = {};
      coordinates.lat = position.coords.latitude;
      coordinates.long = position.coords.longitude;
      $scope.displayMessages(route, coordinates);
    });   
  };

  $scope.doRefresh = function() {
    $scope.findNearby('scroll.refreshComplete');
    $scope.$broadcast('scroll.refreshComplete');
    // $scope.apply();
  };


  //Invokes findNearby on page load of /tabs/messages
  $scope.findNearby('nearby');
});
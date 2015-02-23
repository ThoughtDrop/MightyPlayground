angular.module('thoughtdrop.messageController', [])

.controller('messageController', function($scope, $timeout, $http, Messages, $cordovaGeolocation, $ionicModal) {
  //TODO: change 'findNearby' to 'findNearbyMessages' (more intuitive)
        //limit number of times user can upvote and downvote to one per message
        //modularize all http requests to services
        //look into using socket.io to handle simultaneous upvote/downvote requests from clients
  $scope.message = {};
  $scope.message.text = '';

  $ionicModal.fromTemplateUrl('templates/tab-post.html', {
    scope: $scope
  }).then(function(modal) {
  $scope.modalNewMessage = modal;
  });

  $scope.sortFeed = function(action) {
    console.log('sorting feed by ' + "'" + action + "' messages");
    if (action === 'new') {
      $scope.findNearby('nearby', 'new');
    } else if (action === 'top') {
      $scope.findNearby('nearby', 'top');
    }
  };

  $scope.vote = function(messageID, voteCount, className) {    
    if (className === 'upVote') {
      //Increment vote count in the DOM
      $scope.message.messages.forEach(function(message) {
        if (message._id === messageID) {
          //increment count in DOM
          message.votes++;
          //send incremented count along with messageID to server
          console.log('upVOTING and changing vote to: ' + message.votes);
          //$scope.sendVote(messageID, message.votes);
          $scope.sendData('updatevote', messageID, message.votes);
          console.log('Sending vote of: ' + message.votes + ' to server!');
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
          //$scope.sendVote(messageID, message.votes);
          $scope.sendData('updatevote', messageID, message.votes);
          console.log('Sending vote of: ' + message.votes + ' to server!');
        }
      });
    }
  };

  $scope.sendMessage = function(route) {
    $scope.closeMessageBox();

    $scope.getPosition()
      .then(function(position) {
        var message = $scope.message.text;
        var coordinates = {};
        coordinates.lat = position.coords.latitude;
        coordinates.long = position.coords.longitude;
        $scope.message.text = '';

        $scope.sendData('savemessage', coordinates, message)
        .then(function(resp) {
          console.log('Message ' + "'" + resp + "'" + ' was successfully posted to server');
          //return resp;
        })
        .catch(function(err) {
          console.log('Error posting message: ',  err);
        });
      })
      .then(function() {
        $scope.findNearby('nearby');
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

  $scope.displayMessages = function(route, coordinates, sortMessagesBy) {
    $scope.sendData(route, coordinates, sortMessagesBy)
      .then(function (resp) {
        //populate scope with all messages within 100m of user
        console.log('Received ' + resp.data.length + ' messages within 100m of '+ JSON.stringify(coordinates) + ' from server:', resp.data);
        $scope.message.messages = resp.data;
      });    
  };

  $scope.getPosition = function() {
    //returns a promise that will be used to resolve/ do work on the user's GPS position
    return $cordovaGeolocation
              .getCurrentPosition()    
  };

  $scope.findNearby = function(route, sortMessagesBy) {
    $scope.getPosition()
    .then(function(position) {
      //TODO: Just send the position and access the coordinates server side
      var coordinates = {};
      coordinates.lat = position.coords.latitude;
      coordinates.long = position.coords.longitude;
      $scope.displayMessages(route, coordinates, sortMessagesBy);
    });   
  };

  $scope.doRefresh = function() {
    //TODO: Refresh needs to pass in 'top' or 'new' depending on the last feed sort button 
    //that was pressed. If you pressed 
    $scope.findNearby('scroll.refreshComplete');
    $scope.$broadcast('scroll.refreshComplete');
    // $scope.apply();
  };


  //Invokes findNearby on page load for /tabs/messages
  $scope.findNearby('nearby');
});
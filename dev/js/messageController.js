angular.module('thoughtdrop.messageController', [])

.controller('messageController', function($scope, $timeout, $http, Messages, $cordovaGeolocation, $ionicModal) {
  
  $scope.message = {};
  $scope.message.text = '';

  $ionicModal.fromTemplateUrl('templates/tab-post.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalNewMessage = modal;
  });

  $scope.sendVote = function(messageID, voteCount) {
    console.log('Sending vote of: ' + voteCount + ' to server!');
    var data = {}
    data.messageID = messageID;
    data.voteCount = voteCount;

  return $http({
     method: 'POST',
     url: '/api/messages/votes',
     data: JSON.stringify(data)
   })
  };

//for some reason, I'm adding the value of the count from the dom to the database
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
      })
     
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
      })
    }
  }


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


    console.log('sending Geolocation data! ' + data.message);
    return $http({
      method: 'POST',
      url: //base
      '/api/messages',
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
        url:  //base
        '/api/messages/nearby',
        data: JSON.stringify(data)
      })
      .then(function (resp) {
        console.log('Server resp to func call to findNearby', resp);  
        $scope.message.messages = resp.data;
      });
    };
    console.log('MESSAGE ARRAY', $scope.message.messages);
    
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

  $scope.doRefresh = function() {
    $scope.findNearby('scroll.refreshComplete');
    $scope.$broadcast('scroll.refreshComplete');
    // $scope.apply();
  }

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
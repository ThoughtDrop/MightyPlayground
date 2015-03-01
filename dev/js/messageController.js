angular.module('thoughtdrop.messageController', [])

.controller('messageController', function($scope, $timeout, $http, $cordovaGeolocation, $ionicModal, $cordovaCamera, $location, $state,MessageDetail, Vote, SaveMessage, $window, $localStorage, CachePublicMessages) {
  //TODO: change 'findNearby' to 'findNearbyMessages' (more intuitive)
        //limit number of times user can upvote and downvote to one per message
        //modularize all http requests to services
        //look into using socket.io to handle simultaneous upvote/downvote requests from clients
  $scope.message = {};
  $scope.message.messagesToDisplay = null;
  $scope.message.text = '';

  //Keeps track of what 'feed sort' the user is currently on to inform what data to fetch on a 'pull refresh'
  $scope.page = 'new';
  $scope.images = [];

  $ionicModal.fromTemplateUrl('templates/tab-post.html', {
    scope: $scope
  }).then(function(modal) {
  $scope.modalNewMessage = modal;
  });

  $scope.formatDate = function(date) {
     return moment(date).fromNow();
  };

  $scope.setPage = function(page) {
    $scope.page = page;
  };

  $scope.sortFeed = function(action) {
    $scope.setPage(action);
    console.log('sorting feed by ' + "'" + action + "' messages");
    if (action === 'new') {
      $scope.message.messagesToDisplay =  CachePublicMessages.newMessages;
    } else if (action === 'top') {
      $scope.message.messagesToDisplay =  CachePublicMessages.topMessages;
    }
  };

  $scope.handleVote = function(message, className) {
    Vote.handleVote(message, className);
  };

  $scope.clickHidden = function() {
    console.log('you clicked me!');
    angular.element(document.querySelector( '#imageInput' ))[0].click();
  };

  $scope.sendMessage = function() {
    $scope.closeMessageBox();
    
    $scope.getPosition()
      .then(function(position) {
        var message = {};
        message.id = JSON.stringify(Math.floor(Math.random()*100000));
        message.text = $scope.message.text;
        message.coordinates = {};
        message.coordinates.lat = position.coords.latitude;
        message.coordinates.long = position.coords.longitude;
        $scope.message.text = '';
        SaveMessage.sendMessage(message, function() {
          $scope.findNearby('nearby');
        });
      });
  };


  $scope.sendMessage = function() {
    $scope.closeMessageBox();
    $scope.getPosition()
      .then(function(position) {
        var message = {};
        message.id = JSON.stringify(Math.floor(Math.random()*100000));
        message.text = $scope.message.text;
        message.coordinates = {};
        message.coordinates.lat = position.coords.latitude;
        message.coordinates.long = position.coords.longitude;
        $scope.message.text = '';

        SaveMessage.sendMessage(message, function() {
          $scope.findNearby('nearby');
        });
      });
  };

  $scope.cachePublicMessages = function(route, sortMessagesBy) {
    console.log('fetching public messages');
    if (sortMessagesBy === 'new') {
      CachePublicMessages.findNearby(route, 'new'); //calls factory
    } else if (sortMessagesBy === 'top') {
      $timeout(function() {
        CachePublicMessages.findNearby(route, 'top'); //calls factory
      }, 2000);
    }
  };

  $scope.closeMessageBox = function(time) {
    var time = time || 250;
    $timeout(function() {
      $scope.modalNewMessage.hide();
    }, time);
  };

  $scope.sendData = function(route) {
    var data = Array.prototype.slice.call(arguments, 1);
    console.log('sendData : ' + JSON.stringify(data));
    var route = route || "";
    //returns a promise that will be used to resolve/ do work on the data returned by the server
    return $http({
      method: 'POST',
      url:  //base
      '/api/messages/' + route,
      data: JSON.stringify(data)
    });
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
    return $cordovaGeolocation.getCurrentPosition();
  };
  
  $scope.findNearby = function(route, sortMessagesBy) {
    $scope.getPosition()
    .then(function(position) {
      var coordinates = {};
      coordinates.lat = position.coords.latitude;
      coordinates.long = position.coords.longitude;
      $scope.displayMessages(route, coordinates, sortMessagesBy);
    });   
  };

  $scope.doRefresh = function() {
    CachePublicMessages.findNearby('nearby', 'new', function() {
      if ($scope.page === 'new') {
        $scope.message.messagesToDisplay =  CachePublicMessages.newMessages;
        $scope.$broadcast('scroll.refreshComplete'); //Stops pull refresh loading spinner
        console.log('New Messages Cache from Controller: ', CachePublicMessages.newMessages);
      }
    });

    CachePublicMessages.findNearby('nearby', 'top', function() {
      if ($scope.page === 'top') {
        $scope.message.messagesToDisplay =  CachePublicMessages.topMessages;
        $scope.$broadcast('scroll.refreshComplete'); //Stops pull refresh loading spinner
        console.log('Top Messages Cache from Controller: ', CachePublicMessages.topMessages);    
      }
    });
  };  

  $scope.cacheMessages = function() {
    console.log('////fetched and cached "NEW" messages during login on controller: ',CachePublicMessages.newMessages);
    console.log('////fetched and cached "TOP" messages during login on controller: ',CachePublicMessages.topMessages);

    if ($scope.page === 'new') {
      $scope.message.messagesToDisplay =  CachePublicMessages.newMessages;
    } else if ($scope.page === 'top') {
      $scope.message.messagesToDisplay =  CachePublicMessages.topMessages;
    }
  };

  $scope.cacheMessages();

  //Invokes findNearby on page load for /tabs/messages
  //$scope.findNearby('nearby');

});
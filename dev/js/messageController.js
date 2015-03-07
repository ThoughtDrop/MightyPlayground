angular.module('thoughtdrop.messageController', [])


.controller('messageController', function($scope, $timeout, $http, $cordovaGeolocation, $ionicModal, $cordovaCamera, $location, $state, MessageDetail, Vote, $window, $localStorage, CachePublicMessages, $ionicLoading, Messages) {
  //TODO: change 'findNearby' to 'findNearbyMessages' (more intuitive)
        //limit number of times user can upvote and downvote to one per message
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
      //ensure messages are filtered by top 
      $scope.sortbyVoteCount(CachePublicMessages.topMessages);
      $scope.message.messagesToDisplay =  CachePublicMessages.topMessages;
    }
  };

  $scope.sortbyVoteCount = function(messages) {
    messages.sort(function(a, b) {
      return b.votes - a.votes;
    })
  };

  $scope.handleVote = function(message, className) {
    Vote.handleVote(message, className);
  };

  $scope.showLoading = function() {
    $ionicLoading.show({
      // content: '<i class="icon ion-loading-c"></i>',
      content: 'Showing Loading Indicator!',
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 200,
      showDelay: 500
    }); 
  };

  $scope.hideLoading = function() {
    $scope.loadingIndicator.hide();
  };
    
  $scope.storeImage = function() {
    Messages.storeImage();
  };

  $scope.sendMessage = function() {
    var callback = function() {
      //After getting messages from db and caching in factory, pull messages from factory into controller
      $scope.cacheMessages();
      //Close message box and stop loading spinner
      $scope.closeMessageBox();
      $ionicLoading.hide();
    };
    // After clicking send, show Loading Spinner and Get Position
    $scope.showLoading();
    $scope.getPosition()
    .then(function(position) {
      var message = {};
      message.id = JSON.stringify(Math.floor(Math.random()*100000));
      message.text = $scope.message.text;
      message.coordinates = {};
      message.coordinates.lat = position.coords.latitude;
      message.coordinates.long = position.coords.longitude;
      $scope.message.text = '';
      //if image was taken, Messages.globalImage will not be null, send message with globalImage
      var photo = Messages.returnGlobal();
      if (Object.keys(photo).length > 0) {
        console.log('yay we have a photo!');
        console.log(Object.keys(photo));
        console.log(JSON.stringify(photo));
        //Call sendMessage in factory to save message in DB and pull in fresh messages cache
        Messages.sendMessage(message, photo, callback);
      } else { 
        console.log('no photo!');

        Messages.sendMessage(message, null, callback);
    }
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

  $scope.closeMessageBox = function(time) {
    var time = time || 250;
    $timeout(function() {
      $scope.modalNewMessage.hide();
    }, time);
  };
  
  $scope.newMessage = function() {
    $scope.modalNewMessage.show();
  };
  
  $scope.getPosition = function() {
    //returns a promise that will be used to resolve/ do work on the user's GPS position
    return $cordovaGeolocation.getCurrentPosition();
  };
  
  $scope.doRefresh = function() {
    CachePublicMessages.findNearby('nearby', 'new', function() {
      if ($scope.page === 'new') {
        $scope.message.messagesToDisplay =  CachePublicMessages.newMessages;
        $scope.$broadcast('scroll.refreshComplete'); //Stops pull refresh loading spinner
      }
    });

    CachePublicMessages.findNearby('nearby', 'top', function() {
      if ($scope.page === 'top') {
        $scope.message.messagesToDisplay =  CachePublicMessages.topMessages;
        $scope.$broadcast('scroll.refreshComplete'); //Stops pull refresh loading spinner
      }
    });
  };  

  $scope.cacheMessages = function() {

    if ($scope.page === 'new') {
      $scope.message.messagesToDisplay =  CachePublicMessages.newMessages;
      console.log('Pulling cached "NEW" messages from factory into controller: ', CachePublicMessages.newMessages);
    } else if ($scope.page === 'top') {
      $scope.message.messagesToDisplay =  CachePublicMessages.topMessages;
      console.log('Pulling cached "TOP" messages from factory into controller: ', CachePublicMessages.topMessages);
    }
  };

  $scope.cacheMessages();

});
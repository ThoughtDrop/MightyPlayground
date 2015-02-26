angular.module('thoughtdrop.privateController', [])

.controller('privateController', function($scope, $timeout, $ionicModal, Private, Geolocation, $window, $localStorage, $cordovaContacts) {
  //TODO: change 'findNearby' to 'findNearbyMessages' (more intuitive)
        //limit number of times user can upvote and downvote to one per message
        //modularize all http requests to services
        //look into using socket.io to handle simultaneous upvote/downvote requests from clients
  $scope.message = {};
  $scope.message.text = '';
  $scope.page = 'new';
  $scope.recipients = []; //store phoneNumbers of recipients
  $scope.privateMessages = {};

  $ionicModal.fromTemplateUrl('templates/tab-privatePost.html', {
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
          _id: Math.floor(Math.random()*100000),
          location: {coordinates: [position.coords.longitude, position.coords.latitude]},
          message: $scope.message.text,
          // creator: window.localStorage.userInfo,
          recipients: $scope.recipients
        };

        $scope.message.text = '';

        Private.saveMessage(data)
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

  $scope.getRecipients = function() {
    //store all the recipeints from contacts list into the $scope.recipients array
  };

  $scope.getContactList = function() {
      $cordovaContacts.find({filter: '', multiple:true}).then(function(result) {
        console.log(result);
          $scope.contacts = result;
          console.log('$scope recipients: ' + $scope.recipients);
      }, function(error) {
          console.log('ERROR: ' + error);
      });
  };

  //send coordinates & users's phone number
  $scope.findPrivateMessages = function () {
    var userPhone = window.localStorage.userInfo.phoneNumber;
    console.log(userPhone);
    Geolocation.getPosition()
      .then(function(position) {
        var data = {  //send user phoneNumber & coordinates
          // userPhone: userPhone,
          coordinates: coordinate = {
            lat: position.coords.latitude,
            long: position.coords.longitude
          }
        };
        Private.getMessages(data)
        .then(function(resp) {
          $scope.privateMessages = resp.data;
          console.log('resp.data: ' + resp.data);
          console.log('$scope.privateMessages: ' + $scope.privateMessages);
        });
      })
  };

  $scope.findPrivateMessages();

});
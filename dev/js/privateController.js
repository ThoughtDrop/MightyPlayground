angular.module('thoughtdrop.privateController', [])

.controller('privateController', function($scope, $timeout, $ionicModal, Private, Geolocation, $window, $localStorage, $cordovaContacts, $location, PrivateDetail, GeofenceService, $state, $stateParams) {

  //TODO: change 'findNearby' to 'findNearbyMessages' (more intuitive)
        //limit number of times user can upvote and downvote to one per message
        //modularize all http requests to services
        //look into using socket.io to handle simultaneous upvote/downvote requests from clients
  $scope.message = {};
  $scope.message.text = '';
  $scope.page = 'new';
  $scope.recipients = [5106047443]; //number hardcoded for testing reasons
  $scope.privateMessages = {};
  $scope.data = {selectedContacts: []};

  $ionicModal.fromTemplateUrl('templates/tab-privatePost.html', {
    scope: $scope
  }).then(function(modal) {
  $scope.modalNewMessage = modal;
  });

  $scope.setPage = function(page) {
    $scope.page = page;
  };

  $scope.storeImage = function() {
    Private.storeImage()
    .then(function(resp) {
      console.log('success: ' + resp);
    })
    .catch(function(err) {
      console.log(err) ;
    });
  };

  $scope.sendMessage = function() {
    console.log('sendMessage!');
    // console.log('userInfo: ' + JSON.stringify($localStorage.userInfo));

    Geolocation.getPosition()
      .then(function(position) {
        
        // var creator = $localStorage.userInfo.name; //get user's name from local storage
        var creator = 'p3tuh'; //ONLY FOR TESTING!
        
        var photo = Private.returnGlobal();
        // console.log('/////photo object stringified: ' + JSON.stringify(photo));

        var messageData = {
          _id: Math.floor(Math.random()*100000),
          location: { coordinates: [ position.coords.longitude, position.coords.latitude], type: 'Point' },
          message: $scope.message.text,
          photo_url: photo.shortUrl,
          imageData: photo.src,
          signedUrl: photo.signedUrl,
          _creator: creator,
          recipients: $scope.recipients,
          isPrivate: true,
          replies: [],
          _creatorPhoto: $localStorage.userInfo.picture.data.url 
        };

        Private.tempStorage(messageData); //store the message data and update coordinates later in the map view

          $scope.message.text = ''; //clear the message  for next message
          console.log($scope.message);
          $scope.recipients = []; //clear the recipients array for next message
          $scope.closeMessageBox();
          $scope.data.selectedContacts = []; //clear contacts for next message
          //return resp;
          
        $scope.closeMessageBox();
        $location.path('/map');
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

  $scope.pickContact = function() {

    Private.pickContact()
      .then(function(contact) {
          $scope.newMessage();
          $scope.data.selectedContacts.push(contact);
          var number = contact.phones[0].value.replace(/\W+/g, "");
          console.log(' # before regex & slice' + number);
          var phoneNumber;

          if (number.length > 10) {  
            var sliced = parseInt(number.slice(1));
            var phoneNumber = {phoneNumber: sliced};
            $scope.recipients.push(phoneNumber);
            console.log(JSON.stringify($scope.recipients));
          } else {
            var parsed = parseInt(number);
            var phoneNumber = {phoneNumber: parsed};
            $scope.recipients.push(phoneNumber);
            console.log(JSON.stringify($scope.recipients));
          }

          // $scope.recipients.push(contact.phones[0].value));

          console.log('RECIPIENT!: ' + $scope.recipients);

        },
        function(failure) {
            console.log("Bummer.  Failed to pick a contact");
        });

  };

  //send coordinates & users's phone number
  $scope.findPrivateMessages = function () {
    console.log('user info1234: ' + JSON.stringify($localStorage.userInfo));

    // var userPhone = $localStorage.userInfo.phoneNumber;
    var userPhone = 5106047443; //CHNAGE THIS BACK, ONLY FOR TESTING!!

    Geolocation.getPosition()     //get users's position
      .then(function(position) {
          
        var data = {  //send user phoneNumber & coordinates
          latitude: position.coords.latitude, 
          longitude: position.coords.longitude,
          userPhone: userPhone
        };
        
        Private.getPrivate(data) //fetch ALL private messages for user
        .then(function(resp) {
          console.log('RESP ' + JSON.stringify(resp));
          $scope.privateMessages.messages = Private.findInRange(data, resp);

          PrivateDetail.storeMessages($scope.privateMessages.messages); //stores private messgaes for quick 


          console.log('$scope.privateMessages51000: ' + JSON.stringify($scope.privateMessages.messages))  

          Private.watchGeoFence(resp);
        })
        .catch(function(err) {
          console.log('Error posting message: ' +  JSON.stringify(err));
        });
      });
  };

  $scope.doRefresh = function() {
    $scope.findPrivateMessages('scroll.refreshComplete');
    $scope.$broadcast('scroll.refreshComplete');
    // $scope.apply();
  };

  $scope.storeImage = function() {
    Private.storeImage();
  };


  $scope.removeContact = function(contact) {
    console.log(contact);
    for (var i = 0; i <  $scope.data.selectedContacts.length; i++){
      if (contact.displayName === $scope.data.selectedContacts[i].displayName) {
        $scope.data.selectedContacts.splice(i, 1);
      }
    }
  };

  $scope.findPrivateMessages();

});
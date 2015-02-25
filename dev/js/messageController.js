angular.module('thoughtdrop.messageController', [])

.controller('messageController', function($scope, $timeout, $http, $cordovaGeolocation, $ionicModal, $cordovaCamera, $state, MessageDetail, Vote) {
  //TODO: change 'findNearby' to 'findNearbyMessages' (more intuitive)
        //limit number of times user can upvote and downvote to one per message
        //modularize all http requests to services
        //look into using socket.io to handle simultaneous upvote/downvote requests from clients
  $scope.message = {};
  $scope.message.text = '';
  //Keeps track of what 'feed sort' the user is currently on to inform what data to fetch on a 'pull refresh'
  $scope.page = 'new';
  $scope.images = [];

  $ionicModal.fromTemplateUrl('templates/tab-post.html', {
    scope: $scope
  }).then(function(modal) {
  $scope.modalNewMessage = modal;
  });

  $scope.setPage = function(page) {
    $scope.page = page;
  };

  $scope.sortFeed = function(action) {
    $scope.setPage(action);
    console.log('sorting feed by ' + "'" + action + "' messages");
    if (action === 'new') {
      $scope.findNearby('nearby', 'new');
    } else if (action === 'top') {
      $scope.findNearby('nearby', 'top');
    }
  };

  $scope.handleVote = function(message, className) {
    Vote.handleVote(message, className);
  };

//camera code
    $scope.urlForImage = function(imageName) {
      var name = imageName.substr(imageName.lastIndexOf('/') + 1);
      var trueOrigin = cordova.file.dataDirectory + name;
      return trueOrigin;
    };
 
    $scope.addImage = function() {
        // 2. The options array is passed to the cordova Camera with specific options. 
        // For more options see the official docs for cordova camera.
        var options = {
            destinationType : Camera.DestinationType.FILE_URI,
            sourceType : Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY  .CAMERA    .SAVEDPHOTOALBUM
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            correctOrientation: true
        };
         
        // 3. Call the ngCodrova module cordovaCamera we injected to our controller
        $cordovaCamera.getPicture(options).then(function(imageData) {

          console.log(imageData);
 
            // 4. When the image capture returns data, we pass the information to our success function, 
            // which will call some other functions to copy the original image to our app folder.
            onImageSuccess(imageData);
 
            function onImageSuccess(fileURI) {
                createFileEntry(fileURI);
            }
 
            function createFileEntry(fileURI) {
                window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
            }
 
            // 5. This function copies the original file to our app directory. As we might have to deal 
            // with duplicate images, we give a new name to the file consisting of a random string and the original name of the image.
            function copyFile(fileEntry) {
                var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                var newName = makeid() + name;
 
                window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
                    fileEntry.copyTo(
                        fileSystem2,
                        newName,
                        onCopySuccess,
                        fail
                    );
                },
                fail);
            }
             
            // 6. If the copy task finishes successful, we push the image url to our scope array of images. 
            //Make sure to use the apply() function to update the scope and view!
            function onCopySuccess(entry) {
                $scope.$apply(function () {
                    $scope.images.push(entry.nativeURL);
                });
            }
 
            function fail(error) {
                console.log("fail: " + error.code);
            }
 
            function makeid() {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
 
                for (var i=0; i < 5; i++) {
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                return text;
            }
 
        }, function(err) {
            console.log(err);
        });
    };


// ==========END OF CAMERA CODE


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
      var coordinates = {};
      coordinates.lat = position.coords.latitude;
      coordinates.long = position.coords.longitude;
      $scope.displayMessages(route, coordinates, sortMessagesBy);
    });   
  };

  $scope.doRefresh = function() {
    if ($scope.page === 'new') {
      $scope.findNearby('nearby', 'new', 'scroll.refreshComplete');
    } else if ($scope.page === 'top') {
      $scope.findNearby('nearby', 'top', 'scroll.refreshComplete');
    }

    $scope.$broadcast('scroll.refreshComplete');
    // $scope.apply();
  };

  $scope.getReplies = function(message_obj) {
    MessageDetail.passOver(message_obj);
    $state.go('messagedetail');//need to ask pass along message_obj
  }

  //Invokes findNearby on page load for /tabs/messages
  $scope.findNearby('nearby');
});

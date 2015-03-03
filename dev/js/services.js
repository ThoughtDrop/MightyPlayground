angular.module('thoughtdrop.services', [])

.factory('CachePublicMessages', function($http, $cordovaGeolocation) {
  var cacheMessages = function(route, data, sortMessagesBy, callback) {
    sendData(route, data)
      .then(function (resp) {
        //cache all public messages messages within 100m of user
        if (sortMessagesBy === 'new') {
          factory.newMessages = resp.data;
          console.log('Caching ' + resp.data.length + " " + sortMessagesBy + '-public messages within 100m of '+ JSON.stringify(data) + ' from db on FACTORY:', resp.data);

          if (callback) {
            callback();
          }
        } else if (sortMessagesBy === 'top') {
          factory.topMessages = resp.data;
          console.log('Caching ' + resp.data.length + " " + sortMessagesBy + '-public messages within 100m of '+ JSON.stringify(data) + ' from db on FACTORY:', resp.data);

          if (callback) {
            callback();
          }
        }
      });
  };

  var getPosition1 = function() {
    //returns a promise that will be used to resolve/ do work on the user's GPS position
    return $cordovaGeolocation.getCurrentPosition();
  };

  var getPosition2 = function() {
    //returns a promise that will be used to resolve/ do work on the user's GPS position
    return $cordovaGeolocation.getCurrentPosition();
  };

  var findNearby = function(route, sortMessagesBy, callback) {
    if (sortMessagesBy === 'new') {
      getPosition1()
      .then(function(position) {
        var coordinates = {};
        coordinates.lat = position.coords.latitude;
        coordinates.long = position.coords.longitude;
        cacheMessages(route, coordinates, sortMessagesBy, callback);
      });
    } else if (sortMessagesBy === 'top') {
      getPosition2()
      .then(function(position) {
        var coordinates = {};
        coordinates.lat = position.coords.latitude;
        coordinates.long = position.coords.longitude;
        cacheMessages(route, coordinates, sortMessagesBy, callback);
      });
    }
  };

  var sendData = function(route) {
    var data = Array.prototype.slice.call(arguments, 1);
    var route = route || "";
    //returns a promise that will be used to resolve/ do work on the data returned by the server
    return $http({
      method: 'POST',
      url:  //base
      '/api/messages/' + route,
      data: JSON.stringify(data)
  });
 }

 var factory = {
   newMessages: 'apple',
   topMessages: 'orange',
   cacheMessages: cacheMessages,
   getPosition1: getPosition1,
   getPosition2: getPosition2,
   findNearby: findNearby,
   sendData: sendData
 };

return factory;

})

.factory('Vote', function($http){

  //Keeps track of which buttons should be locked
  var upVoteButtonLock = {};
  var downVoteButtonLock = {};

  var handleVote = function(message, className) {
    //If upvoting
    if (className === 'upVote') {
        //If this message is not an upVoteButtonLock property or the button is not locked
        if (!upVoteButtonLock[message._id] ) {
        //Lock upvote button by setting upVoteButtonLock[message._id] to True
        upVoteButtonLock[message._id] = true;
        //Increment vote in DOM and send incremented vote to server
        incrementVote(message);
        //Unlock downvote button by setting downVoteButtonLock[message._id] to False
        downVoteButtonLock[message._id] = false;

        } else if (upVoteButtonLock[message._id] === true) { //Otherwise, if upVoteButtonLock[message._id] is True
        //Unlock downvote button by setting downVoteButtonLock[message._id] to False
        downVoteButtonLock[message._id] = false;
        }
    //If downvoting
    } else if (className === 'downVote') {
        //If downVoteButtonLock[message._id] exists OR is False
        if (!downVoteButtonLock[message._id] ) {
        //Lock downvote button by setting downVoteButtonLock[message._id] to True
        downVoteButtonLock[message._id] = true;
        //Decrement vote in DOM and send decremented vote to server
        decrementVote(message);
        //Unlock upvote button by setting upVoteButtonLock[message._id] to False
        upVoteButtonLock[message._id] = false;

        } else if (upVoteButtonLock[message._id] === true) { //Otherwise, if upVoteButtonLock[message._id] is True
        //Unlock downvote button by setting downVoteButtonLock[message._id] to False
        downVoteButtonLock[message._id] = false;
        }
    }
  };

  var incrementVote = function(message) {
      //Increment vote count in the DOM
      message.votes++;
      console.log('upVOTING and changing vote to: ' + message.votes);
      //send incremented count along with messageID to server
      sendData('updatevote', message._id, message.votes);
      console.log('Sending vote of: ' + message.votes + ' to server!');
  };

  var decrementVote = function(message) {
      //Decrement vote count in the DOM
      message.votes--;
      console.log('downVOTING and changing vote to: ' + message.votes);
      //send decremented count along with messageID to server
      sendData('updatevote', message._id, message.votes);
      console.log('Sending vote of: ' + message.votes + ' to server!');
  };

  var sendData = function(route) {
    var data = Array.prototype.slice.call(arguments, 1);
    var route = route || "";
    //returns a promise that will be used to resolve/ do work on the data returned by the server
    return $http({
      method: 'POST',
      url:  //base
      '/api/messages/' + route,
      data: JSON.stringify(data)
    });
  };

  return {
    upVoteButtonLock: upVoteButtonLock,
    downVoteButtonLock: downVoteButtonLock,
    handleVote: handleVote,
    sendData: sendData
  };
})


.factory('MessageDetail', function(CachePublicMessages){
  var allMessages = CachePublicMessages.newMessages;
  var get = function(messageid) {
    for (var i = 0; i < allMessages.length; i++) {
      if (allMessages[i]._id === parseInt(messageid)) {
        return allMessages[i];
      }
    }
    return null;
  };

  return {
    get: get
  };

  var findNearby = function() {
    var sendPosition = function(data) {
      return $http({
        method: 'POST',
        url: //base
        '/api/messages/nearby',
        data: JSON.stringify(data)
      })
      .then(function (resp) {
        console.log('Server resp to func call to findNearby: ', resp);
        return resp.data;
      });
    };

    $cordovaGeolocation
    .getCurrentPosition()
    .then(function(position) {
      var coordinates = {};
      coordinates.lat = position.coords.latitude;
      coordinates.long = position.coords.longitude;
      sendPosition(coordinates);
      console.log('Messages factory sending coordinates to server: ', coordinates);
    });
  };

  return {
    getMessages: getMessages,
    findNearby: findNearby
  };
})

.factory('Facebook', function($http, $localStorage){

  var dataStorage = {};

  var keepInfo = function(data) {
    dataStorage.userData = data;
    console.log('FB factory keepInfo triggered: ', JSON.stringify(dataStorage.userData.data));
  };

  var storeUser = function(data) {
    console.log('storeUser triggered: ', JSON.stringify(data));
    console.log('data Storage123: ' + JSON.stringify(dataStorage));
    dataStorage.userData.phoneNumber = data.phoneNumber;
    console.log('final data before sending to db: ', JSON.stringify(dataStorage.userData));
    $localStorage.userInfo = dataStorage.userData;
    console.log('userINFO IN LOCAL STORAGE ' + JSON.stringify($localStorage.userInfo));

    return $http({
      method: 'POST',
      url: //base
      '/api/auth/id',
      data: JSON.stringify(dataStorage.userData)
    })
    .then(function(resp) {
      console.log('Server resp to func call to storeUser: ', resp);
    });
  };

  return {
    storeUser: storeUser,
    keepInfo: keepInfo
  };
})

.factory('Messages', function($http, $cordovaCamera){
  var globalImage = {};

  var sendMessage = function(message, image) {
    //if there is an image, do a put request to the signed url to upload the image
    if (image) {
      return $http({
        method: 'PUT',
        url: resp.data.signedUrl,
        data: imgURI,
        headers: {
          'Content-Type': 'image/jpeg'
        },
      })
      .then(function(resp) {
        console.log('the response image successfully uploaded!');
        console.log('message from promise -1 exists?: ' + message);
        message.id = image.id;
        return $http({
          method: 'POST',
          url:  //base
          '/api/messages/' + 'savemessage',
          data: JSON.stringify(message)
        });
      })
      .then(function(resp) {
        console.log('message saved successfully!');
      })
      .catch(function(err) {
        console.log('there was an error: ' + err);
      });
    } else {
      //if thre isn't an image, just send the message as is
      return $http({
        method: 'POST',
        url:  //base
        '/api/messages/' + 'savemessage',
        data: JSON.stringify(message)
      })
      .then(function(resp) {
        console.log('message saved successfully!');
      })
      .catch(function(err) {
        console.log('there was an error: ' + err);
      });
    }
  };

  var storeImage = function() {
    console.log('store image activated');
    var options = {
      destinationType : 0,
      sourceType : 1,
      allowEdit : true,
      encodingType: 0,
      quality: 30,
      targetWidth: 320,
      targetHeight: 320,
    };

    $cordovaCamera.getPicture(options)
    .then(function(imageData) {
      var imgURI = ('data:image/jpeg;base64,' + imageData);
      globalImage.src = imgURI;
      globalImage.id = Math.floor(Math.random()*100000000);
      console.log('globalImage src: ' + globalImage.src);
      console.log('globalImage id: ' + globalImage.id);
      return $http({
        method: 'PUT',
        url: //base
        '/api/messages/getsignedurl',
        data: JSON.stringify(globalImage)
      })
      .then(function(resp) {
        globalImage.shortUrl = resp.body.shortUrl;
        globalImage.signedUrl = resp.body.signedUrl;
        console.log('successfully got response URL!');
        console.log('short img url: ' + globalImage.shortUrl);
        console.log('signed img url: ' + globalImage.signedUrl);
      });
    });
  };

  return {
    sendMessage: sendMessage,
    storeImage: storeImage
  };
});
.factory('Messages', function($http, $cordovaCamera){
  var globalImage = {};

  var returnGlobal = function() {
    return globalImage;
  };

  var sendMessage = function(message, image) {
    //if there is an image, do a put request to the signed url to upload the image
    console.log(globalImage.signedUrl);
    if (image) {
      return $http({
        method: 'PUT',
        url: globalImage.signedUrl,
        data: globalImage.src,
        headers: {
          'Content-Type': 'image/jpeg'
        },
      })
      .then(function(resp) {
        console.log('the response image successfully uploaded!');
        console.log('message from promise -1 exists?: ' + message);
        message.id = image.id;
        return $http({
          method: 'POST',
          url:  //base
          '/api/messages/' + 'savemessage',
          data: JSON.stringify(message)
        });
      })
      .then(function(resp) {
        console.log('message saved successfully!');
        //call to DB to get top and new streams, then cache them
        CachePublicMessages.cacheMessages('nearby', message.coordinates, 'new', callback);
        CachePublicMessages.cacheMessages('nearby', message.coordinates, 'top', callback);
        })
      .catch(function(err) {
        console.log('there was an error in save image: ' + err);
      });
    } else {
      //if thre isn't an image, just send the message as is
      return $http({
        method: 'POST',
        url:  //base
        '/api/messages/' + 'savemessage',
        data: JSON.stringify(message)
      })
      .then(function(resp) {
        console.log('message saved successfully!');
        CachePublicMessages.cacheMessages('nearby', message.coordinates, 'new', callback);
        CachePublicMessages.cacheMessages('nearby', message.coordinates, 'top', callback);
      })
      .catch(function(err) {
        console.log('there was an error in save message: ' + err);
      });
    }
  };

  var storeImage = function() {
    console.log('store image activated');
    var options = {
      destinationType : 0,
      sourceType : 1,
      allowEdit : true,
      encodingType: 0,
      quality: 30,
      targetWidth: 320,
      targetHeight: 320,
    };

    $cordovaCamera.getPicture(options)
    .then(function(imageData) {
      var imgURI = ('data:image/jpeg;base64,' + imageData);
      globalImage.src = imgURI;
      globalImage.id = Math.floor(Math.random()*100000000);
      console.log('globalImage src: ' + globalImage.src);
      console.log('globalImage id: ' + globalImage.id);
      return $http({
        method: 'PUT',
        url: //base
        '/api/messages/getsignedurl',
        data: JSON.stringify(globalImage)
      })
      .then(function(resp) {
        console.log('success!' + JSON.stringify(resp));
        console.log('resp shorturl!' + resp.data.shortUrl);
        console.log('resp signedurl!' + resp.data.signedUrl);
        globalImage.shortUrl = resp.data.shortUrl;
        globalImage.signedUrl = resp.data.signedUrl;
        console.log('successfully got response URL!');
        console.log('globalimage short img url: ' + globalImage.shortUrl);
        console.log('globalimage signed img url: ' + globalImage.signedUrl);
      });
    });
  };

  return {
    sendMessage: sendMessage,
    storeImage: storeImage,
    returnGlobal:returnGlobal
  };
});
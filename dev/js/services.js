angular.module('thoughtdrop.services', [])

.factory('findNearbyMessages', function($http, $cordovaGeolocation) {
  var messages = null;

  var storeMessages = function(route, coordinates, sortMessagesBy) {
    $scope.sendData(route, coordinates, sortMessagesBy)
      .then(function (resp) {
        //populate scope with all messages within 100m of user
        console.log('Received ' + resp.data.length + ' messages within 100m of '+ JSON.stringify(coordinates) + ' from server:', resp.data);
        $scope.message.messages = resp.data;
      });   
  };
    
  var getPosition = function() {
    //returns a promise that will be used to resolve/ do work on the user's GPS position
    return $cordovaGeolocation.getCurrentPosition();
  };
    
  var findNearby = function(route, sortMessagesBy) {
    $scope.getPosition()
    .then(function(position) {
      var coordinates = {};
      coordinates.lat = position.coords.latitude;
      coordinates.long = position.coords.longitude;
      $scope.displayMessages(route, coordinates, sortMessagesBy);
    });   
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


return {
  messages: messages,
  storeMessages: storeMessages,
  getPosition: getPosition,
  findNearby: findNearby,
  sendData: sendData
};

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
        upVoteButtonLock[message._id] = true;dataStorage.userData.data.phoneNumber = data.phoneNumber
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

.factory('MessageDetail', function(){

//ignore for now! this is for testing
  // var chats = [{
  //   id: 0,
  //   name: 'Ben Sparrow',
  //   message: 'You on your way?',
  //   face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  // }, {
  //   id: 1,
  //   name: 'Max Lynx',
  //   message: 'Hey, it\'s me',
  //   face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  // }, {
  //   id: 2,
  //   name: 'Andrew Jostlin',
  //   message: 'Did you get the ice cream?',
  //   face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  // }, {
  //   id: 3,
  //   name: 'Adam Bradleyson',
  //   message: 'I should buy a boat',
  //   face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  // }, {
  //   id: 4,
  //   name: 'Perry Governor',
  //   message: 'Look at my mukluks!',
  //   face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  // }];

  var allMessages;

  var storeMessages = function(messages) {
    allMessages = messages;
    console.log('messages stored on factory: ', allMessages);
  };

  var get = function(messageid) {
    for (var i = 0; i < allMessages.length; i++) {
      if (allMessages[i]._id === parseInt(messageid)) {
        return allMessages[i];
      }
    }
    return null;
  };

  // var passOver = function(data) {
    // particularMessage = data;
    // return location.path('/messagedetail')
  // };

  // var destroyCurrent = function() {
    // particularMessage = null;
  // };

  // var getCurrentMessage = function() {
    // return particularMessage || 'Please select go back & select a message!';
  // };
  
  return {
    // all: function() {
    //   return chats;
    // },
    // remove: function(chat) {
    //   chats.splice(chats.indexOf(chat), 1);
    // },
    // get: function(chatId) {
    //   for (var i = 0; i < chats.length; i++) {
    //     if (chats[i].id === parseInt(chatId)) {
    //       return chats[i];
    //     }
    //   }
    //   return null;
    // },
    // passOver: passOver,
    // destroyCurrent: destroyCurrent,
    // getCurrentMessage: getCurrentMessage,
    get: get,
    storeMessages: storeMessages
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

.factory('Facebook', function($http){

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


.factory('SaveMessage', function($http){ 
  var image = {};

  var saveImage = function(data) {
    console.log('image saved!');
    image.data = data;
  };

  var creds = {
    bucket: 'mpbucket-hr23',
    access_key: 'AKIAJOCFMQLT2OTUDEJQ',
    secret_key: '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'
  };

  var sendMessage = function(message) {

  //   console.log('image about to be uploaded');
  //   AWS.config.update({ accessKeyId: creds.access_key, secretAccessKey: creds.secret_key });
  //   AWS.config.region = 'us-west-1';
  //   var bucket = new AWS.S3({ params: { Bucket: creds.bucket } });

  //   if(image.data) {
  //    var params = { Key: message.id, ContentType: image.data.type, Body: image.data, ServerSideEncryption: 'AES256' };
  //     bucket.putObject(params, function(err, data) {
  //       if(err) {
  //         console.log(err.message);
  //         return false;
  //       } else {
  //         console.log('Upload Done');
    // console.log('image about to be uploaded');
    // AWS.config.update({ accessKeyId: creds.access_key, secretAccessKey: creds.secret_key });
    // AWS.config.region = 'us-west-1';
    // var bucket = new AWS.S3({ params: { Bucket: creds.bucket } });

    // if(image.data) {
    //  var params = { Key: message.id, ContentType: image.data.type, Body: image.data, ServerSideEncryption: 'AES256' };
    //   bucket.putObject(params, function(err, data) {
    //     if(err) {
    //       console.log(err.message);
    //       return false;
    //     } else {
    //       console.log('Upload Done');
          return $http({
            method: 'POST',
            url:  //base
            '/api/messages/' + 'savemessage',
            data: JSON.stringify(message)
          });
        //   }
        // }
      // .on('httpUploadProgress',function(progress) {
      //   console.log(Math.round(progress.loaded / progress.total * 100) + '% done');
      //   })
    //   );
    // } else {
      // No File Selected
      //alert('No File Selected');
  //   }
  };

  return {
    // saveImage: saveImage,
    sendMessage: sendMessage
  };
  //TODO refactor camera portion to be server side and also 
  // return $http({
  //     method: 'POST',
  //     url: '/api/messages/saveimage',
  //     data: JSON.stringify(image.data)
  //   })
  //   .then(function(resp) {
  //     console.log('Server resp to func call to storeUser: ', resp);
  //   });
  // };
});
angular.module('thoughtdrop.services', [])


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
    })
  };

  return {
    upVoteButtonLock: upVoteButtonLock,
    downVoteButtonLock: downVoteButtonLock,
    handleVote: handleVote,
    sendData: sendData
  }

})

.factory('MessageDetail', function(){
  var particularMessage;
  
  var passOver = function(data) {
    particularMessage = data;
    // return location.path('/messagedetail')
  }

  var destroyCurrent = function() {
    particularMessage = null;
  }

  var getCurrentMessage = function() {
    return particularMessage || 'Please select go back & select a message!';
  }
  return {
    passOver: passOver,
    destroyCurrent: destroyCurrent,
    getCurrentMessage: getCurrentMessage
  };
})
.factory('Facebook', function($http){

  var dataStorage = {};

  console.log(JSON.stringify(dataStorage));

  var keepInfo = function(data) {
    dataStorage.userData = data;
    console.log('FB factory keepInfo triggered: ', JSON.stringify(dataStorage.userData.data));
  };

  var updatePhone = function(data) {
    dataStorage.userData.phoneNumber = data.phoneNumber;
    console.log('FB factory updatePhone triggered : ', JSON.stringify(dataStorage.userData));
  };

  var storeUser = function(data) {
    console.log('storeUser triggered: ', JSON.stringify(data));
    dataStorage.userData.data.phoneNumber = data.phoneNumber; 
    console.log('final data before sending to db: ', JSON.stringify(dataStorage.userData.data));

    return $http({
      method: 'POST',
      url: //base
      '/api/auth/id',
      data: JSON.stringify(dataStorage.userData.data)
    })
    .then(function(resp) {
      console.log('Server resp to func call to storeUser: ', resp);
    });
  };

  return {
    updatePhone: updatePhone,
    storeUser: storeUser,
    keepInfo: keepInfo
  };
});
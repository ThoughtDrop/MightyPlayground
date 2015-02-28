angular.module('thoughtdrop.privateDetailController', [])
.controller('privateDetailController', function($scope, $state, $http, Private, $stateParams, $window, $localStorage, PrivateDetail){
  
  $scope.message = PrivateDetail.get($stateParams._id);
  $scope.message.replies = [];
  console.log('Object in here is: ' + JSON.stringify($scope.message));
  console.log($stateParams._id);
  var creator = 'p3tuh'
  // var creator = $localStorage.userInfo.name;

  $scope.addReply = function(replyText, messageID) { //store this reply message as an array inside the individual private messages for simplicity
    console.log('REPLY: ' + replyText);
    console.log(messageID);

    var reply = {
      messageid: messageID,
      message: replyText,
      _creator: creator
      // picture: $localStorage.userInfo.picture //store picture later
    };

    console.log('reply data: ' + JSON.stringify(reply));
    $scope.message.replies.push(reply);
    PrivateDetail.saveReply(reply); //server req to save this reply to the initial message
    $scope.message.text = ''; 
    console.log($scope.message.replies);
  };

});
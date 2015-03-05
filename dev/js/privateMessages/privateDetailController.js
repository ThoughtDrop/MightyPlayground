angular.module('thoughtdrop.privateDetailController', [])
.controller('privateDetailController', function($scope, $state, $http, $stateParams, $window, $localStorage, PrivateDetail){
  
  // $scope = {};

  console.log('ID: ' + $stateParams._id);
  $scope.message = PrivateDetail.get($stateParams._id);
  if ($scope.message.photo_url) {
    return $http({
      method: 'GET',
      url: $scope.message.photo_url
    })
    .then(function(resp) {
      console.log('resp after downloading image to s3' + resp.data);
      $scope.message.image = resp.data;
      console.log('/////////');
    })
    .catch(function(err) {
      console.log(err);
    });
  }
  // $scope.$apply();
  console.log('||||||||||||');
  console.log('resp after downloading image to s3' + resp);
  $scope.message.image = resp.data;

  console.log('Object in here is: ' + JSON.stringify($scope.message));
  var creator = $localStorage.userInfo.name;
  console.log(JSON.stringify($localStorage.userInfo));
   // var creator = 'p3tuh' //ONLY FOR TESTING COMMENT OUT!

  $scope.addReply = function(replyText, messageID) { //store this reply message as an array inside the individual private messages for simplicity
    var reply = {
      messageid: messageID,
      message: replyText,
      _creator: creator
      // picture: $localStorage.userInfo.picture //store picture later
    };

    console.log("PDC addreply " + reply);
    // console.log('reply data: ' + JSON.stringify(reply));
    PrivateDetail.saveReply(reply); //server req to save this reply to the initial message
    $scope.message.replies.push(reply); //pushes to $scope for instant rendering
    $scope.message.text = ''; 
    console.log($scope.message.replies);
  };

});
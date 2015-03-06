angular.module('thoughtdrop.messageDetailController', [])
.controller('messageDetailController', function($scope, $state, $http, MessageDetail, $stateParams, $timeout){
  
  $scope.message = MessageDetail.get($stateParams._id);
  console.log('Object in here is: ' + $scope.message);
  console.log($stateParams._id);
  console.log($scope);
  console.log(Object.keys($scope));

  $scope.sendData = function(route, data) {
    console.log(route);
    console.log(data);
    var route = route || "";
    //returns a promise that will be used to resolve/ do work on the data returned by the server
    return $http({
      method: 'POST',
      url:  //base
      '/api/messages/' + route,
      data: JSON.stringify(data)
    });
  };

  $scope.addReply = function(replyText, messageid) {
    console.log('reply: ' + replyText);
    var reply = {};
    reply.text = replyText;
    reply.messageid = messageid;

    console.log(reply);

    $scope.sendData('addreply', reply);
    $scope.message.replies.push(reply.text);
    $scope.message.text = ''; 
  };

  $scope.message.photo = function() {
    if ($scope.message.photo_url) {
      console.log($scope.message.photo_url);
      return $http({
        method: 'GET',
        url: $scope.message.photo_url,
      })
      .then(function(resp) {
        $scope.message.image = (resp.data);
      });
    }
  };

  $scope.message.photo();
});
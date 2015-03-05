angular.module('thoughtdrop.messageDetailController', [])
.controller('messageDetailController', function($scope, $state, $http, MessageDetail, $stateParams, $timeout){
  
  $scope.message = MessageDetail.get($stateParams._id);
  console.log('object in here is: ' + $scope.message);

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
});
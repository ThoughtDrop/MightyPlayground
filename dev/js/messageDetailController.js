angular.module('thoughtdrop.messageDetailController', [])
.controller('messageDetailController', function(MessageDetail, $stateParams){
  
  $scope.message = MessageDetail.get($stateParams._id);
  console.log($scope.message);
  $scope.message.text = '';


  // $scope.particular = MessageDetail.getCurrentMessage();

  $scope.sendData = function(route) {
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

  $scope.addReply = function(reply, id) {
    $scope.sendData('addMessageDetail', reply, id);
    $scope.message.messageDetail.push(reply);
    $scope.message.text = ''; 
  };
});
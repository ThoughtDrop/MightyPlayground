angular.module('starter.messageController', [])

.controller('messageController', function($scope, $http, Messages) {
  $scope.message = {};
  $scope.message.text = '';

  $scope.sendMessage = function(message) {

    var data = {};
    data.message = message;

    console.log('sending data! ' + data.message);
    return $http({
      method: 'POST',
      url: '/api/messages',
      data: JSON.stringify(data)
    })
    .then(function(resp) {
      console.log('send message successful!');
      return resp.data;
    })
    .catch(function(err) {
      console.log(err);
    });
  },

  $scope.getAll = function() {

    Messages.getMessages() 
      .then(function(data) {
        $scope.message.messages = data;
      })

  };

  $scope.getAll();
});
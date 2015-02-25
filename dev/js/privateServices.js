angular.module('thoughtdrop.privateServices', [])

.factory('Private', function($http) {

  var saveMessage = function(data) {
    console.log('private data: ' + JSON.stringify(data));

    return $http({
      method: 'POST',
      url:  //base
      '/api/messages/',
      data: JSON.stringify(data)
    })
  };

  var getMessages = function(data) {

    return $http({
      method: 'POST',
      url: //base
      '/api/private/nearby'
    })
    
  };

  return {
    saveMessage: saveMessage,
    getMessages: getMessages
  };
})
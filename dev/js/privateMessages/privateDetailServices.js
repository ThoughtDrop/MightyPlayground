angular.module('thoughtdrop.privateDetailServices', [])

.factory('PrivateDetail', function($http, $q) {

  var messageStorage = {};

  var storeMessages = function(messages) {   //once fetched, this stores messages in the factory for later retrieval
    messageStorage = messages;
    console.log('private messages stored on factory: ', messageStorage);
  };

  var get = function(messageid) {
    for (var i = 0; i < messageStorage.length; i++) {
      if (messageStorage[i]._id === parseInt(messageid)) {
        console.log(messageStorage[i]._id);
        return messageStorage[i];
      }
    }
    return null;
  };

  var saveReply = function(data) {
    console.log('PDS saveReply: ' + JSON.stringify(data));

    return $http({ 
      method: 'POST',
      url: //base
      '/api/messages/private/addreply',
      data: JSON.stringify(data)
    })
    .then(function(resp) {
      console.log('Server resp to func call to private reply: ', resp);
    }) 
  };

  return {
    storeMessages : storeMessages,
    get: get,
    saveReply: saveReply
  };
});
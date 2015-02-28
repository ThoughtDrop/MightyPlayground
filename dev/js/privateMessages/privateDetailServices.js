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
//       "messageid":999,"message":"Goop","_creator":"Peter Kim"}
// 2015-02-28 12:55:02.309 myApp[2018:609694] [{"messageid":999,"message":"Goop","_creator":"Peter Kim"}]
    return $http({ 
      method: 'POST',
      url: //base
      'api/messages/privateMessages/addreply',
      data: JSON.stringify(data)
    })
  };

  return {
    storeMessages : storeMessages,
    get: get,
    saveReply: saveReply
  };
});
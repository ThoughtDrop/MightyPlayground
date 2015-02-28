angular.module('thoughtdrop.privateServices', [])

.factory('Private', function($http, $q) {

  var messageStorage = {};

  var saveMessage = function(data) {
    console.log('SERVICES private message to save before server: ' + JSON.stringify(data));
    //  {"_id":46510,"location":{"coordinates":[-122.4088877813168,37.78386394962462],"type":"Point"},"message":"Peter","_creator":"Peter Kim","recipients":[5106047443],"isPrivate":true,"replies":[]}
    return $http({
      method: 'POST',
      url:  //base
      '/api/messages/private',
      data: JSON.stringify(data)
    })
  };

  var getPrivate = function(data) {
      console.log("SERVERICES DATA: " + JSON.stringify(data));
    return $http({
      method: 'POST',
      url: //base
      '/api/messages/private/nearby',
      data: JSON.stringify(data)
    })
    .then(function (resp) {
        console.log('PRIVATE MESSAGES in SERVICES: ', JSON.stringify(resp.data));  
        return resp.data;
    });
    
  };

  var formatContact = function(contact) {

    return {
      "displayName"   : contact.name.formatted || contact.name.givenName + " " + contact.name.familyName || "Mystery Person",
      "emails"        : contact.emails || [],
      "phones"        : contact.phoneNumbers || [],
      "photos"        : contact.photos || []
    };

  };

  var pickContact = function() {
    var deferred = $q.defer();
    if(navigator && navigator.contacts) {
      navigator.contacts.pickContact(function(contact){
          deferred.resolve( formatContact(contact) );
      });
    } else {
        deferred.reject("Bummer.  No contacts in desktop browser");
    }

    return deferred.promise;
  };




  return {
    saveMessage: saveMessage,
    getPrivate: getPrivate,
    pickContact: pickContact
  };
})
angular.module('thoughtdrop.privateServices', [])

.factory('Private', function($http, $q) {

  var saveMessage = function(data) {
    console.log('private message to save: ' + JSON.stringify(data));

    return $http({
      method: 'POST',
      url:  //base
      '/api/messages/private',
      data: JSON.stringify(data)
    })
  };

  var getMessages = function(data) {

    return $http({
      method: 'POST',
      url: //base
      '/api/messages/private/nearby'
    })
    
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
    getMessages: getMessages,
    pickContact: pickContact
  };
})
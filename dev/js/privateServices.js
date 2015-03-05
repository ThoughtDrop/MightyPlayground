angular.module('thoughtdrop.privateServices', [])

.factory('Private', function($http, $q, $location, $state, GeofenceService) {

  var messageStorage = {};

  var tempStorage = function(obj) {
    messageStorage = obj;
    console.log(messageStorage);
  }

  var saveMessage = function(data, dist) {
    messageStorage.location = { coordinates: [ data.lng(), data.lat()], type: 'Point' };
    messageStorage.radius = dist;

    // messageStorage.radius = 1000;
    console.log('PServices message to save before server: ' + JSON.stringify(messageStorage));
    //  {"_id":46510,"location":{"coordinates":[-122.4088877813168,37.78386394962462],"type":"Point"},"message":"Peter","_creator":"Peter Kim","recipients":[5106047443],"isPrivate":true,"replies":[]}
    return $http({
      method: 'POST',
      url:  //base
      '/api/messages/private',
      data: JSON.stringify(messageStorage)
    })
      .then(function (resp) {
        console.log("private message saved");
        $state.go('tab.privateMessages');
      });
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

  var watchGeoFence = function(message) { //message is an array of message objects
    // console.log('geofence Data: ' + JSON.stringify(message[0]));

    for (var i = 0; i < message.length; i++){  //beastly object for local watching geofence
      // var geoFence = {
      //   id: message[i]._id,
      //   latitude: message[i].location.coordinates[1],
      //   longitude: message[i].location.coordinates[0],
      //   radius: 100,
      //   transitionType: 1,
      //   notification: {
      //     id: message[i]._id,
      //     title: 'ThoughDrop',
      //     text: message[i].message,
      //     openAppOnClick: true,
      //     data: {
      //       id: message[i].id,
      //       latitude: message[i].location.coordinates[1],
      //       longitude: message[i].location.coordinates[0],
      //       radius: 100,
      //       transitionType: 1,
      //       notification: {id : message[i]._id, title: 'ThoughtDrop', text: '', openAppOnClick: true}
      //     }
      //   }
      // };

      var geoFence = {
        id: message[i]._id.toString(),
        latitude: message[i].location.coordinates[1],
        longitude: message[i].location.coordinates[0],
        radius: message[i].radius,
        transitionType: 1,
        notification: {
          id: message[i]._id,
          title: 'ThoughDrop',
          text: message[i].message,
          openAppOnClick: true,
          data: {
            id: message[i].id,
            latitude: message[i].location.coordinates[1],
            longitude: message[i].location.coordinates[0],
            radius: message[i].radius,
            transitionType: 1,
            notification: {id : message[i]._id, title: 'ThoughtDrop', text: '', openAppOnClick: true}
          }
        }
      };
      
      console.log('final geofence111 : ' + JSON.stringify(geoFence));
      GeofenceService.addOrUpdate(geoFence);    
    }

  }




  return {
    saveMessage: saveMessage,
    getPrivate: getPrivate,
    pickContact: pickContact,
    tempStorage: tempStorage,
    watchGeoFence: watchGeoFence
  };
})
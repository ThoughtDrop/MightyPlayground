angular.module('thoughtdrop.privateServices', [])

.factory('Private', function($http, $q, $location, $state, $cordovaCamera, GeofenceService) {

  var messageStorage = {};
  var globalImage = {};

  var returnGlobal = function() {
    return globalImage;
  };

  var tempStorage = function(obj) {
    messageStorage = obj;
    console.log(messageStorage);
  };

  var saveMessage = function(data, dist) {
    messageStorage.location = { coordinates: [ data.lng(), data.lat()], type: 'Point' };
    messageStorage.radius = dist;

    // messageStorage.radius = 1000;
    console.log('PServices message to save before server: ' + JSON.stringify(messageStorage));
    //  {"_id":46510,"location":{"coordinates":[-122.4088877813168,37.78386394962462],"type":"Point"},"message":"Peter","_creator":"Peter Kim","recipients":[5106047443],"isPrivate":true,"replies":[]}
    console.log('/////messageStorage stringified: ' + JSON.stringify(messageStorage));
    return $http({
        method: 'PUT',
        url: messageStorage.signedUrl,
        data: messageStorage.imageData, //change to image.src?
        headers: {
          'Content-Type': 'image/jpeg'
        }})
        .then(function(resp) {
          delete messageStorage.imageData;
          delete messageStorage.signedUrl;
          console.log('private image saved');
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
    console.log('before watching message555: ' + JSON.stringify(message));
    for (var i = 0; i < message.length; i++){  

      var geoFence = {  //message object to be stored and watched on device
        id: message[i]._id.toString(),
        latitude: message[i].location.coordinates[1],
        longitude: message[i].location.coordinates[0],
        radius: message[i].radius || 100,
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
            radius: message[i].radius || 100,
            transitionType: 1,
            notification: {id : message[i]._id, title: 'ThoughtDrop', text: '', openAppOnClick: true}
          }
        }
      };
      console.log('final geofence111 : ' + JSON.stringify(geoFence));
      GeofenceService.addOrUpdate(geoFence);    
    }
  };

  var storeImage = function() {
    console.log('store image activated');
    var options = {
      destinationType : 0,
      sourceType : 1,
      allowEdit : true,
      encodingType: 0,
      quality: 30,
      targetWidth: 320,
      targetHeight: 320,
    };

    $cordovaCamera.getPicture(options)
    .then(function(imageData) {
      globalImage.src = 'data:image/jpeg;base64,' + imageData;
      globalImage.id = Math.floor(Math.random()*100000000);
      console.log('globalImage src: ' + globalImage.src);
      console.log('globalImage id: ' + globalImage.id);
      return $http({
        method: 'PUT',
        url: //base
        '/api/messages/getsignedurl',
        data: JSON.stringify(globalImage)
      })
      .then(function(resp) {
        globalImage.shortUrl = resp.data.shortUrl;
        globalImage.signedUrl = resp.data.signedUrl;
        console.log('successfully got response URL!');
        console.log('globalimage short img url: ' + globalImage.shortUrl);
        console.log('globalimage signed img url: ' + globalImage.signedUrl);
      });
    });
  };

  var calculateDistance = function (lat1, lon1, lat2, lon2) {
  var R = 6371;
  var a = 
     0.5 - Math.cos((lat2 - lat1) * Math.PI / 180)/2 + 
     Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
     (1 - Math.cos((lon2 - lon1) * Math.PI / 180))/2;

    return R * 2 * Math.asin(Math.sqrt(a));
  };

  var findInRange = function(userPosition, array) {
    var messagesWithinRange = [];
    for (var i = 0; i < array.length; i++){
      var messageLat = array[i].location.coordinates[1];
      var messageLong = array[i].location.coordinates[0];
      var messageRad = array[i].radius || 100;
        //if message between user and each message is less than message's radius, return as a valid message to be viewed
      if (calculateDistance(userPosition.latitude, userPosition.longitude, messageLat, messageLong, messageRad) <= messageRad) {
        messagesWithinRange.push(array[i]);
      }
    }
    return messagesWithinRange;
  };


  return {
    returnGlobal: returnGlobal,
    tempStorage: tempStorage,
    saveMessage: saveMessage,
    getPrivate: getPrivate,
    formatContact: formatContact,
    pickContact: pickContact,
    storeImage: storeImage,
    watchGeoFence: watchGeoFence,
    findInRange: findInRange,
    calculateDistance: calculateDistance
  };
});

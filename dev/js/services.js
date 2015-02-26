angular.module('thoughtdrop.services', [])

.factory('Messages', function($http, $cordovaGeolocation) {

  var getMessages = function() {
    return $http({
      method: 'GET',
      url: //base
      '/api/messages/'
    })
    .then(function (resp) {
      console.log('Server resp to func call to getMessages: ', resp);  
      return resp.data;
    });
  };

  var findNearby = function() {
    var sendPosition = function(data) {
      return $http({
        method: 'POST',
        url: //base
        '/api/messages/nearby',
        data: JSON.stringify(data)
      })
      .then(function (resp) {
        console.log('Server resp to func call to findNearby: ', resp);  
        return resp.data;
      });
    };
    
    $cordovaGeolocation
    .getCurrentPosition()
    .then(function(position) {
      var coordinates = {};
      coordinates.lat = position.coords.latitude;
      coordinates.long = position.coords.longitude;
      sendPosition(coordinates);
      console.log('Messages factory sending coordinates to server: ', coordinates);
    });
  };

  return {
    getMessages: getMessages,
    findNearby: findNearby
  };
})

.factory('Facebook', function($http){

  var dataStorage = {};

  console.log(JSON.stringify(dataStorage));

  var keepInfo = function(data) {
    dataStorage.userData = data;
    console.log('FB factory keepInfo triggered: ', JSON.stringify(dataStorage.userData.data));
  };

  var updatePhone = function(data) {
    dataStorage.userData.phoneNumber = data.phoneNumber;
    console.log('FB factory xdatePhone triggered : ', JSON.stringify(dataStorage.userData));
  };

  var storeUser = function(data) {
    console.log('storeUser triggered: ', JSON.stringify(data));
    dataStorage.userData.data.phoneNumber = data.phoneNumber; 
    console.log('final data before sending to db: ', JSON.stringify(dataStorage.userData.data));

    return $http({
      method: 'POST',
      url: //base
      '/api/auth/id',
      data: JSON.stringify(dataStorage.userData.data)
    })
    .then(function(resp) {
      console.log('Server resp to func call to storeUser: ', resp);
    });
  };

  return {
    updatePhone: updatePhone,
    storeUser: storeUser,
    keepInfo: keepInfo
  };
})


.factory('SaveMessage', function($http){ 
  var image = {};

  var saveImage = function(data) {
    console.log('image saved!');
    image.data = data;
  };

  var creds = {
    bucket: 'mpbucket-hr23',
    access_key: 'AKIAJOCFMQLT2OTUDEJQ',
    secret_key: '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'
  };

  var sendMessage = function(message) {
    console.log('image about to be uploaded');
    AWS.config.update({ accessKeyId: creds.access_key, secretAccessKey: creds.secret_key });
    AWS.config.region = 'us-west-1';
    var bucket = new AWS.S3({ params: { Bucket: creds.bucket } });

    if(image.data) {
     var params = { Key: message.id, ContentType: image.data.type, Body: image.data, ServerSideEncryption: 'AES256' };
      bucket.putObject(params, function(err, data) {
        if(err) {
          console.log(err.message);
          return false;
        } else {
          console.log('Upload Done');
          return $http({
            method: 'POST',
            url:  //base
            '/api/messages/' + 'savemessage',
            data: JSON.stringify(message)
          });
          }
        }
      // .on('httpUploadProgress',function(progress) {
      //   console.log(Math.round(progress.loaded / progress.total * 100) + '% done');
      //   })
      );
    } else {
      // No File Selected
      alert('No File Selected');
    }
  };

  return {
    saveImage: saveImage,
    sendMessage: sendMessage
  };
  //TODO refactor camera portion to be server side and also 
  // return $http({
  //     method: 'POST',
  //     url: '/api/messages/saveimage',
  //     data: JSON.stringify(image.data)
  //   })
  //   .then(function(resp) {
  //     console.log('Server resp to func call to storeUser: ', resp);
  //   });
  // };
});
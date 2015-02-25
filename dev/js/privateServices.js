angular.module('thoughtdrop.privateServices', [])

.factory('Private', function($http) {

  var sendData = function(route, data) {
    console.log('servceis sendData!');
    // var data = Array.prototype.slice.call(arguments, 1);
    console.log('private data: ' + JSON.stringify(data));
    var route = route || "";
    console.log(route);
    //returns a promise that will be used to resolve/ do work on the data returned by the server
    return $http({
      method: 'POST',
      url:  //base
      '/api/messages/' + route,
      data: JSON.stringify(data)
    })
  };

  return {
    sendData: sendData
  };
})


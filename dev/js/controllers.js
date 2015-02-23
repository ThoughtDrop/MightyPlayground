angular.module('thoughtdrop.controllers', [])

.controller('AuthCtrl', function($scope, $cordovaOauth, $location, $localStorage, $http, Facebook, $window, $state){

  $scope.data = {};

  $scope.login = function() {
    $cordovaOauth.facebook(427819184047831, []).then(function(result) {
      $scope.data = result;

      $localStorage.accessToken = result.access_token;
      window.localStorage.token = result.access_token; //store token locally
      $scope.getProfile();  //gets profile data and stores profile data in factory

    }, function(error) {
      alert("There was a problem signing in!  See the console for logs");
      console.log(error);
    });

    $location.path("/phone"); // redirect to phone number input
  };

  $scope.getProfile = function() {

    if($localStorage.hasOwnProperty("accessToken") === true) {
      $http.get("https://graph.facebook.com/v2.2/me", {
        params: {
          access_token: $localStorage.accessToken,
          fields: "id,name,picture",
          format: "json"
        }
      })
      //TODO can we do function(result, error) or is function(result), then function(error) required?
      //doesn't seem very promise-y, or use a .catch? - Rob
      .then(function(result) {
        $scope.data = result;
        Facebook.keepInfo($scope.data); //saves userData in factory
      }, function(error) {
          alert("There was a problem getting your profile.  Check the logs for details.");
          console.log(error);
      });
    } else {
      alert("Not signed in");
      $location.path("/login");
    }
  };

  $scope.storeUser = function() {
    console.log('storeUser triggered - phoneNumber: ', $scope.data.phoneNumber);
    Facebook.storeUser($scope.data);
    $location.path('/tab/messages');
  };

  $scope.logout = function() {
    window.localStorage.token = undefined; //TODO is it a better practice for this to be null? - Rob
    $location.path('/login');
  };

  //TODO: What is the difference between init and getProfile?  Is this legacy code? - Rob
  $scope.init = function() {
    console.log('init triggered');
      if($localStorage.hasOwnProperty("accessToken") === true) {
        $http.get("https://graph.facebook.com/v2.2/me", {
          params: {
            access_token: $localStorage.accessToken,
            fields: "id,name,gender,location,website,picture,relationship_status",
            format: "json"
          }
        })
        .then(function(result) {
          $scope.profileData = result.data;
          console.log('init!');
          console.log(JSON.stringify(result.data.id));
          $scope.data.id = result.data.id;
          return result.data.id;
        }, function(error) {
          alert("There was a problem getting your profile.  Check the logs for details.");
          console.log(error);
        });
    } else {
      alert("Not signed in");
      $location.path("/login");
    }
  };

  $scope.updatePhone = function() {
    Facebook.updatePhone($scope.data);
      //check if id & # matches for returning users in db
        //otherwise redirect to /login
    $location.path('/tab/messages');
  };
});
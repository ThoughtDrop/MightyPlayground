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

     // if($localStorage.hasOwnProperty("accessToken") === true) {
       $http.get("https://graph.facebook.com/v2.2/me", {
         params: {
           access_token: $localStorage.accessToken,
           fields: "id,name,picture",
           format: "json"
         }
       })
       .then(function(result) {
        console.log('KEEP INFO 1');
        console.log('fb data: ' + JSON.stringify(result.data));
        Facebook.keepInfo(result.data) //saves userData in factory
        })

      .catch(function(error) {
          console.log('error!: ' + error);
        })
   //     }, function(error) {
   //         alert("There was a problem getting your profile.  Check the logs for details.");
   //         console.log(error);
   //     });
   //   else {
   //     alert("Not signed in");
   //     $location.path("/login");
   //   }
   // };
 };

   $scope.storeUser = function() {
    console.log('storeUser triggered - phoneNumber: ', $scope.data.phoneNumber);
    Facebook.storeUser($scope.data);
    
    $location.path('/tab/messages');
  };

  $scope.logout = function() {
    window.localStorage.token = undefined; 
    window.localStorage.userInfo = undefined;
    $location.path('/login');
  };

});
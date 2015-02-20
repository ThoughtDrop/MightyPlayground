angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('AuthCtrl', function($scope, $cordovaOauth, $location, $localStorage, $http, Facebook, $window, $state){

  $scope.data = {};

  $scope.login = function() {
<<<<<<< HEAD
      $cordovaOauth.facebook(632339323578963, []).then(function(result) {
          $localStorage.accessToken = result.access_token;

          window.localStorage.token = result.access_token;
          // console.log('window: ' + JSON.stringify(window.localStorage.token));
          Facebook.storeId($scope.init());
          $location.path("/phone"); // redirect to phone number input

      }, function(error) {
          alert("There was a problem signing in!  See the console for logs");
          console.log(error);
      });


  };

  $scope.init = function() {
      console.log('init');
          if($localStorage.hasOwnProperty("accessToken") === true) {
              $http.get("https://graph.facebook.com/v2.2/me", { params: { access_token: $localStorage.accessToken, fields: "id,name,gender,location,website,picture,relationship_status", format: "json" }}).then(function(result) {
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
              //$location.path("/login");
          }
      };

  $scope.updatePhone = function() {
    console.log('updatePhone butotn');
    Facebook.updatePhone($scope.data);
      //check if id & # mathches for returning users in db
        //otherwise redirect to /login

    $location.path('/tab/messages')
  };     

  
});















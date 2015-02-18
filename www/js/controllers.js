angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
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

.controller('AuthCtrl', function($scope, $cordovaOauth, $location){

  $scope.login = function() {
      $cordovaOauth.facebook(427819184047831, []).then(function(result) {
          // $localStorage.accessToken = result.access_token;
          $location.path("/tab/messages");
      }, function(error) {
          alert("There was a problem signing in!  See the console for logs");
          console.log(error);
      });
  };
});



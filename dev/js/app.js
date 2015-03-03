angular.module('thoughtdrop', ['ionic', 'thoughtdrop.controllers', 'thoughtdrop.services', 'thoughtdrop.messageController', 'thoughtdrop.messageDetailController', 'ngCordova.plugins.geolocation', 'thoughtdrop.mapController','ngCordova.plugins.camera', 'ngCordovaOauth', 'ngStorage', 'directives','thoughtdrop.privateController', 'thoughtdrop.privateServices', 'ionic.utils', 'ngCordova.plugins.contacts', 'thoughtdrop.geolocation', 'thoughtdrop.privateDetailController', 'thoughtdrop.privateDetailServices'])

.run(function($ionicPlatform, $window, $localStorage, $state, $location, CachePublicMessages, $timeout) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  if(window.localStorage.token === undefined) {
    $location.path('/login');
  } else {
     $state.go('tab.messages');
  }

  var cachePublicMessages = function(route, sortMessagesBy) {
    console.log('fetching public messages');
    if (sortMessagesBy === 'new') {
      CachePublicMessages.findNearby(route, 'new'); //calls factory
    } else if (sortMessagesBy === 'top') {
      $timeout(function() {
        CachePublicMessages.findNearby(route, 'top'); //calls factory
      }, 2000);
    }
  };

  cachePublicMessages('nearby', 'top');
  cachePublicMessages('nearby', 'new');


})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom');

// Ionic uses AngularUI Router which uses the concept of states. Learn more here: https://github.com/angular-ui/ui-router
  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'AuthCtrl'
  })

  .state('phone', {
    url: '/phone',
    templateUrl: 'templates/phonenumber.html',
    controller: 'AuthCtrl'
  })



  .state('map', {
    url: '/map',
    templateUrl: 'templates/map.html',
    controller: 'mapController'
  })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  //  Each tab has its own nav history stack:
  .state('tab.messages', {
    url: '/messages',
    views: {
      'tab-messages': {
        templateUrl: 'templates/tab-messages.html',
        controller: 'messageController'
      }
    }
  })

  .state('tab.message-detail', {
    url: '/messages/:_id',
    views: {
      'tab-messages': {
        templateUrl: 'templates/message-detail.html',
        controller: 'messageDetailController'
      }
    }
  })

  .state('tab.post', {
    url: '/post',
    views: {
      'tab-post': {
        templateUrl: 'templates/tab-post.html',
        controller: 'messageController'
      }
    }
  })

  .state('tab.privateMessages', {
    url: '/privateMessages',
    views: {
      'tab-privateMessages': {
        templateUrl: 'templates/tab-privateMessages.html',
        controller: 'privateController'
      }
    }
  })

  .state('tab.privatePost', {
    url: '/privatePost',
    views: {
      'tab-privatePost': {
        templateUrl: 'templates/tab-privatePost.html',
        controller: 'privateController'
      }
    }
  })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AuthCtrl'
      }
    }
  })

  .state('tab.private-detail', {
    url: '/privateMessages/:_id',
    views: {
      'tab-privateMessages': {
        templateUrl: 'templates/private-detail.html',
        controller: 'privateDetailController'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/messages');
});
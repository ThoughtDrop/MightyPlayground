describe('AuthController', function () {
  var $scope, $rootScope, $location, $window, $httpBackend, createController, Auth;

  // using angular mocks, we can inject the injector
  // to retrieve our dependencies
  beforeEach(module('thoughtdrop'));
  beforeEach(inject(function($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    $window = $injector.get('$window');
    $httpBackend = $injector.get('$httpBackend');
    $scope = $rootScope.$new();

    var $controller = $injector.get('$controller');

    // used to create our AuthController for testing
    createController = function () {
      return $controller('AuthCtrl', {
        $scope: $scope,
        $window: $window,
        $location: $location,
      });
    };

    createController();
  }));

    it("should have a login function", function() {
        expect($scope.login).toBeDefined();
    });

    it("should have a getProfile function", function() {
        expect($scope.getProfile).toBeDefined();
    });

    it("should have a storeUser function", function() {
        expect($scope.storeUser).toBeDefined();
    });

    it("should have a logout function", function() {
        expect($scope.logout).toBeDefined();
    });

    it("should have a init function", function() {
        expect($scope.init).toBeDefined();
    });

    it("should have a updatePhone function", function() {
        expect($scope.updatePhone).toBeDefined();
    });
});

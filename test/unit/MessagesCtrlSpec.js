
describe("Unit Testing Examples", function () {
    var $scope, ctrl, $timeout;
    beforeEach(function () {
        module("thoughtdrop");
        // INJECT! This part is critical
        // $rootScope - injected to create a new $scope instance.
        // $controller - injected to create an instance of our controller.
        // $q - injected so we can create promises for our mocks.
        // _$timeout_ - injected to we can flush unresolved promises.
        inject(function ($rootScope, $controller, $q, _$timeout_) {
            // create a scope object for us to use.
            $scope = $rootScope.$new();
            // assign $timeout to a scoped variable so we can use
            // $timeout.flush() later. Notice the _underscore_ trick
            // so we can keep our names clean in the tests.
            $timeout = _$timeout_;
            // now run that scope through the controller function,
            // injecting any services or other injectables we need.
            // **NOTE**: this is the only time the controller function
            // will be run, so anything that occurs inside of that
            // will already be done before the first spec.
            ctrl = $controller("messageController", {
                $scope: $scope
            });
        });
    });

    it("should have a sortFeed function", function() {
        expect($scope.sortFeed).toBeDefined();
    });

    it("should have a sendVote function", function() {
        expect($scope.sendVote).toBeDefined();
    });

    it("should have a vote function", function() {
        expect($scope.vote).toBeDefined();
    });

    it("should have a submit function", function() {
        expect($scope.submit).toBeDefined();
    });

    it("should have a closeMessageBox function", function() {
        expect($scope.closeMessageBox).toBeDefined();
    });

    it("should have a newMessage function", function() {
        expect($scope.newMessage).toBeDefined();
    });

    it("should have a sendMessage function", function() {
        expect($scope.sendMessage).toBeDefined();
    });

    it("should have a sendData function", function() {
        expect($scope.sendData).toBeDefined();
    });

    it("should have a displayMessages function", function() {
        expect($scope.displayMessages).toBeDefined();
    });

    it("should have a getPosition function", function() {
        expect($scope.getPosition).toBeDefined();
    });

    it("should have a findNearby function", function() {
        expect($scope.findNearby).toBeDefined();
    });

    it("should have a doRefresh function", function() {
        expect($scope.doRefresh).toBeDefined();
    });
});

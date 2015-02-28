angular.module('thoughtdrop.mapController', ['uiGmapgoogle-maps'])

.controller('mapController', function ($scope, $log) {
        //$scope.map.center points to the center all the time. 
        $scope.map = {center: {latitude: 40.1451, longitude: -99.6680 }, zoom: 15, mapTypeId: google.maps.MapTypeId.ROADMAP};
        $scope.options = {scrollwheel: false};
        var events = {
          places_changed: function (searchBox) {
            var position = searchBox.getPlaces()[0].geometry.location;// d & k 
            $scope.map = {center: {latitude: position.k, longitude: position.D }, zoom: 18};
          }
        }
        // console.log($scope.map);

          // console.log(searchBox);
        $scope.searchbox = { template:'searchbox.tpl.html', events:events};

  });
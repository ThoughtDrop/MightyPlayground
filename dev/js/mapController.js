angular.module('thoughtdrop.mapController', [])

  .controller('mapController', function($scope, $ionicLoading) {
        function initialize() {

          var markers = [];
          var map = new google.maps.Map(document.getElementById('map-canvas'), {
            mapTypeId: google.maps.MapTypeId.ROADMAP
          });


        navigator.geolocation.getCurrentPosition(function(pos) {
          console.log(pos);
          map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          var myLocation = new google.maps.Marker({
              position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
              icon: 'img/logo_pin.png',
              map: map,
              title: "My Location"
          });
          map.fitBounds(new google.maps.LatLngBounds(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude)));
        });
          // Create the search box and link it to the UI element.
          var input = /** @type {HTMLInputElement} */(
              document.getElementById('pac-input'));
          map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

          var searchBox = new google.maps.places.SearchBox(
            /** @type {HTMLInputElement} */(input));

          // Listen for the event fired when the user selects an item from the
          // pick list. Retrieve the matching places for that item.
          google.maps.event.addListener(searchBox, 'places_changed', function() {
            var places = searchBox.getPlaces();

            if (places.length == 0) {
              return;
            }
            for (var i = 0, marker; marker = markers[i]; i++) {
              marker.setMap(null);
            }

            //TODO: remove multiple markers
            // For each place, get the icon, place name, and location.
            markers = [];
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0, place; place = places[i]; i++) {
              var image = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
              };

              // Create a marker for each place.
              var marker = new google.maps.Marker({
                map: map,
                icon: 'img/logo_pin.png',
                title: place.name,
                position: place.geometry.location
              });

              markers.push(marker);

              bounds.extend(place.geometry.location);
            }

            map.fitBounds(bounds);
          });

          // Bias the SearchBox results towards places that are within the bounds of the
          // current map's viewport.
          // google.maps.event.addListener(map, 'bounds_changed', function() {
          //   var bounds = map.getBounds();
          //   searchBox.setBounds(bounds);
          // });
        }
      initialize();



    //     var myLatlng = new google.maps.LatLng(37.3000, -120.4833);
    //     var mapOptions = {
    //         center: myLatlng,
    //         zoom: 16,
    //         mapTypeId: google.maps.MapTypeId.ROADMAP
    //     };
 
    //     var map = new google.maps.Map(document.getElementById("map"), mapOptions);
 
        // navigator.geolocation.getCurrentPosition(function(pos) {
        //     map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        //     var myLocation = new google.maps.Marker({
        //         position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
        //         icon: 'img/logo.png',
        //         map: map,
        //         title: "My Location"
        //     });
        // });
    //     $scope.map = map;

    //     //search function
    // function setBounds () {
    //   var bounds = new google.maps.LatLngBounds();
    //   for( var key in markersObj ){
    //     bounds.extend(markersObj[key].getPosition());
    //   }
    //   map.fitBounds(bounds);
    // }
    // //************** SEARCH BAR FUNCTIONALITY ****************//
    //   var input = (document.getElementById('pac-input'));
    //   var searchBox = new google.maps.places.SearchBox(
    //     /** @type {HTMLInputElement} */(input));

    //   // [START region_getplaces]
    //   // Listen for the event fired when the user selects an item from the
    //   // pick list. Retrieve the matching places for that item.
    //   google.maps.event.addListener(searchBox, 'places_changed', function() {
    //     var places = searchBox.getPlaces();
    //     //grab input value inside function once address is submit.
    //     console.log("PLACES: "+ input.value);
    //     if (places.length == 0) {
    //       return;
    //     }

    //     for (var i = 0, place; place = places[i]; i++) {
    //       // Create a marker for each place.
    //       var marker = new google.maps.Marker({
    //         map: map,
    //         position: place.geometry.location
    //       });
    //       infowindow.setContent(input.value);
    //       infowindow.open(map, marker);
    //       var lattLng = place.geometry.location.lat()+', '+place.geometry.location.lng();// d & k 
    //       //markersArray.push(marker);
    //       markersObj[lattLng] = marker;
    //       console.log(lattLng);
    //       setBounds();

    //     // $('<div class="onePoint"><input class="form-control inputSize in_name' + pointCounter +'" value=\"'+ nameParse(input.value)+'\"+></input><a href="#"><img class="xButton" src="css/painted-x.png"></a>'+
    //     //   '<textarea placeholder="Enter location description here" class="inputSize2 form-control in_text' + pointCounter +'"></textarea><br><input type=hidden class="pointAddr' + pointCounter +'"value=\"'+input.value+'\"+></input><input type=hidden class="hiddenLat pointLat' + pointCounter +'"value='+place.geometry.location.lat()+'></input><input type=hidden class="hiddenLng pointLng' + pointCounter++ +'"value='+place.geometry.location.lng()+'></input></div>'
    //     //   ).hide().appendTo('.div_container').fadeIn();//note: pointCounter++ is so the next one with have +1 index.

    //       $('#pac-input').val(''); 
    //       input.value = '';
    //     }
    //   });

  });
angular.module('thoughtdrop.mapController', [])

  .controller('mapController', function($scope, $ionicLoading) {
        var myLatlng = new google.maps.LatLng(37.3000, -120.4833);
        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
 
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
 
        navigator.geolocation.getCurrentPosition(function(pos) {
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                icon: 'img/logo.png',
                map: map,
                title: "My Location"
            });
        });
        $scope.map = map;

      //search function
  function setBounds () {
    var bounds = new google.maps.LatLngBounds();
    for( var key in markersObj ){
      bounds.extend(markersObj[key].getPosition());
    }
    map.fitBounds(bounds);
  }
  //************** SEARCH BAR FUNCTIONALITY ****************//
    var input = (document.getElementById('pac-input'));
    var searchBox = new google.maps.places.SearchBox(
      /** @type {HTMLInputElement} */(input));

    // [START region_getplaces]
    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.
    google.maps.event.addListener(searchBox, 'places_changed', function() {
      var places = searchBox.getPlaces();
      //grab input value inside function once address is submit.
      console.log("PLACES: "+ input.value);
      if (places.length == 0) {
        return;
      }

      for (var i = 0, place; place = places[i]; i++) {
        // Create a marker for each place.
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });
        infowindow.setContent(input.value);
        infowindow.open(map, marker);
        var lattLng = place.geometry.location.lat()+', '+place.geometry.location.lng();// d & k 
        //markersArray.push(marker);
        markersObj[lattLng] = marker;
        console.log(lattLng);
        setBounds();

      // $('<div class="onePoint"><input class="form-control inputSize in_name' + pointCounter +'" value=\"'+ nameParse(input.value)+'\"+></input><a href="#"><img class="xButton" src="css/painted-x.png"></a>'+
      //   '<textarea placeholder="Enter location description here" class="inputSize2 form-control in_text' + pointCounter +'"></textarea><br><input type=hidden class="pointAddr' + pointCounter +'"value=\"'+input.value+'\"+></input><input type=hidden class="hiddenLat pointLat' + pointCounter +'"value='+place.geometry.location.lat()+'></input><input type=hidden class="hiddenLng pointLng' + pointCounter++ +'"value='+place.geometry.location.lng()+'></input></div>'
      //   ).hide().appendTo('.div_container').fadeIn();//note: pointCounter++ is so the next one with have +1 index.

        $('#pac-input').val(''); 
        input.value = '';
      }
    });

  });
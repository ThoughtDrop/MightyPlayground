angular.module('thoughtdrop.mapController', [])

.controller('mapController', function($scope, $log, Private, Geolocation) {
  var global_lat, global_lon;

  // renders google map
  function initialize () {
    var map_canvas = document.getElementById('map-canvas');
    var myLatlng = new google.maps.LatLng(global_lat, global_lon);
    map_options = {
      center: myLatlng,
      zoom: 16, 
      mapTypeId: google.maps.MapTypeId.ROADMAP, 
      panControl: false,
      streetViewControl: false,
      zoomControl: false,
      mapTypeControl: false
    }
    map = new google.maps.Map(map_canvas, map_options)
    //WORKS!!!!
    // setInterval(function(){
    //   console.log(map.getCenter());
    // }, 5000);
    //************** CLICK LISTENER ****************//
    google.maps.event.addListener(map, 'click', function (event) {
        var latitude = event.latLng.lat();
        var longitude = event.latLng.lng();
    });

  //************** SEARCH BAR FUNCTIONALITY ****************//
    var input = (document.getElementById('pac-input'));
    var clearButton = (document.getElementById('clearButton'));
    // var input2 = (document.getElementById('subButton'));
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(clearButton);
    var searchBox = new google.maps.places.SearchBox(
      /** @type {HTMLInputElement} */(input));
    // var autocomplete = new google.maps.places.Autocomplete(input);
    //autocomplete.bindTo('bounds', map);

    // [START region_getplaces]
    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.
    google.maps.event.addListener(searchBox, 'places_changed', function() {
      var position = searchBox.getPlaces()[0].geometry.location;// d & k 
      var newPoint = new google.maps.LatLng(position.lat(), position.lng());
      console.log(newPoint);
      map.setCenter(newPoint);
    });

    // Bias the SearchBox results towards places that are within the bounds of the
    // current map's viewport.
    google.maps.event.addListener(map, 'bounds_changed', function() {
      var bounds = map.getBounds();
      searchBox.setBounds(bounds);
    });
    $scope.clearText = function(){
      document.getElementById('pac-input').value = '';
    }
    // $scope.alert = function(){
    //   alert(map.getCenter());
    // };

    $scope.submit = function(){
      Private.saveMessage(map.getCenter());
    }
    
  }//initialized

  // Google GeoCoder. Returns a physical address from latt and lng. 
  // Quotas: 5 per second and 2500 per day 
  function codeLatLng (latt, Lon, cb) {
    var lat = latt;
    var lng = Lon;
    var latlng = new google.maps.LatLng(lat, lng);

    geocoder.geocode({'latLng': latlng}, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          marker = new google.maps.Marker({
            position: latlng,
            map: map
          });
          markersObj[lat+', '+lng] = marker;
          // infowindow.setContent(results[1].formatted_address);
          // infowindow.open(map, marker);
          setBounds();  

          cb(results[1].formatted_address);
        } else {
          alert('No results found');
        }
      } else {
        alert('Geocoder failed due to: ' + status);
      }
    });
  }
    //TODO: check logic to see if latt and long exist, if not check. 
  if(!!Geolocation.lastPosition){
    var coordinates = Geolocation.lastPosition.coords;
    global_lat = coordinates.latitude;
    global_lon = coordinates.longitude;
    initialize();
  } else {
      Geolocation.getPosition().then(function(position){
        var coordinates = position.coords;
        global_lat = coordinates.latitude;
        global_lon = coordinates.longitude;
        initialize();
      });  
  }
  


  // map title validity checker. 
  // function submitform () {
  //   var f = document.getElementsByTagName('form')[0];
  //   if(f.checkValidity()) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // 
  });
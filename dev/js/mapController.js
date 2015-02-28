angular.module('thoughtdrop.mapController', [])

.controller('mapController', function ($scope, $log) {
        //$scope.map.center points to the center all the time. 
        // TODO: factory passes in the initial latt and long!!!
  var global_lat= 37.771421, global_lon = -122.424469;
  function geoFindMe () {
    if (!navigator.geolocation){
      alert("Geolocation is not supported by your browser");
      return;
    }
    function success (position) {
      var latitude  = position.coords.latitude;
      var longitude = position.coords.longitude;
      //SET GLOBAL
      global_lat = latitude;
      global_lon = longitude;

      initialize();
    };
    function error () {
      alert("Can't find your location. Please adjust settings");
    };

    navigator.geolocation.getCurrentPosition(success, error);
  } //geoFindMe

  // TODO: get latt&long from factory if not run geoFindMe. 


  // used for grabbing title of address
  var nameParse = function (address) {
    console.log(address);
    var temp = address.split(',');
    return temp[0];
  }

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
    // var input2 = (document.getElementById('subButton'));
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
    // map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(input2);
    var searchBox = new google.maps.places.SearchBox(
      /** @type {HTMLInputElement} */(input));

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

    // $scope.alert = function(){
    //   alert(map.getCenter());
    // };
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
    // if(getCookie('latitude') && getCookie('longitude')){
    //   global_lat = parseFloat(getCookie('latitude'));
    //   global_lon = parseFloat(getCookie('longitude'));
    //   google.maps.event.addDomListener(window, 'load', initialize);
    // } else{
    //   google.maps.event.addDomListener(window, 'load', geoFindMe);
    // }
    initialize();


  // map title validity checker. 
  // function submitform () {
  //   var f = document.getElementsByTagName('form')[0];
  //   if(f.checkValidity()) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
  //*****************SUBMIT BUTTON*********************//
  // $('.pushToServer').click(function () {
  //   if(submitform()){
  //   var points_length = $('.onePoint').length;
  //   for( var i = 0; i < points_length; i++ ){
  //     var pointObj = {};
  //     pointObj['name'] = $('.in_name'+i).val();
  //     pointObj['lat'] = $('.pointLat'+i).val();
  //     pointObj['lng'] = $('.pointLng'+i).val();
  //     pointObj['address'] = $('.pointAddr'+i).val();
  //     pointObj['desc'] = $('.in_text'+i).val();

  //     data.locations.push(pointObj);
  //   }
  //   data.mapName = $('#mapTit').val();

  //   $.ajax({
  //       type: "POST",
  //       url: '/createMaps',
  //       data: data,
  //       success: function (res) {
  //         swal({
  //           title: "Your map has been created!",   
  //           text: "You can now view your map",   
  //           type: "success",   
  //           showCancelButton: true,   
  //           confirmButtonColor: "#DD6B55",   
  //           confirmButtonText: "Yes, show me!",   
  //           cancelButtonText: "No, create a new map",   
  //           closeOnConfirm: false,   
  //           closeOnCancel: false }, 
  //           function (isConfirm) {   
  //             if (isConfirm) {     
  //               window.location = '/maps/' + res;  
  //             } else {     
  //               window.location = '/createMaps';  
  //             } 
  //           });
  //       },
  //       error: function () {
  //         swal("Whoops!", "Please submit again" , "error");
  //       }
  //   });
  // } else {
  //   swal("Please Enter a Map Title", "Whoops", "warning");
  // }
  // });
  });
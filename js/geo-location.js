function setGeoLocation(jQuery, map, markers) {
  var geoLocationMarker = null;

  function addMarkerToMap(lat, lng) {
    var location = new google.maps.LatLng(lat, lng);    // turn coordinates into an object
    var icon = {
      url: 'img/marker-pointer.png',
      scaledSize: new google.maps.Size(32, 32), // scaled size
      origin: new google.maps.Point(0,0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    };

    if (geoLocationMarker) geoLocationMarker.setMap(null);

    geoLocationMarker = new google.maps.Marker({
      map: map,
      position: location,
      title: 'My Location',
      icon: icon,
      optimized: true,
      zIndex: 100,
    });

    map.panTo(location);
  }
  
  function initTrigger() {
    jQuery('.geo-location').click(function () {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
          addMarkerToMap(position.coords.latitude, position.coords.longitude);
        });
      }
    });
  }
  
  function init() {
    initTrigger();
  }

  jQuery(document).ready(function () {
    init();
  });
}
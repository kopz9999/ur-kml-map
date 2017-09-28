function setUpFlyToMarker(jQuery, map, markers) {
  var currentMarker = null;
  function itemClick() {
    var index = parseInt(jQuery(this).data('index'));
    var marker = markers[index];
    activateMarker(marker);
    if (currentMarker) closeMarker(currentMarker);
    currentMarker = marker;
  }
  
  function activateMarker(marker) {
    var icon = {
      url: marker.icon.url,
      scaledSize: new google.maps.Size(40, 45), // scaled size
      origin: new google.maps.Point(0,0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    };
    map.panTo(marker.position);
    (new google.maps.event.trigger( marker, 'click' ));
    marker.setZIndex(1000);
    marker.setIcon(icon);
  }
  
  function closeMarker(marker) {
    marker.setZIndex(null);
    marker.infowindow.close();
    marker.setIcon(marker.currentIcon);
  }
  
  function initAccordion() {
    jQuery(".accordion li").bind("click", itemClick);
  }

  function init() {
    initAccordion();
  }

  jQuery(document).ready(function () {
    init();
  });
}

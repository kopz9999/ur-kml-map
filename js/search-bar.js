function setUpSearchBar(jQuery, map, markers) {
  var markersByTitle = {};

  function initMarkers() {
    var currentMarkers, cleanTitle;
    markers.forEach(function (t) {
      cleanTitle = t.title.trim().toLowerCase();
      currentMarkers = markersByTitle[cleanTitle];
      if (!currentMarkers) {
        markersByTitle[cleanTitle] = currentMarkers = [];
      }
      currentMarkers.push(t);
    });
  }

  function setMarkers(cleanTitle, map) {
    var currentMarkers = markersByTitle[cleanTitle];
    if (currentMarkers) {
      currentMarkers.forEach(function (t) { t.setMap(map) });
    }
  }

  function hideMarkers(cleanPlaceDescription) {
    setMarkers(cleanPlaceDescription, null);
  }

  function showMarkers(cleanPlaceDescription) {
    setMarkers(cleanPlaceDescription, map);
  }
  
  function initSearchBar() {
    var accordionContents = jQuery('.accordion-content ul li');
    var input = jQuery('#mobile-search-bar');
    var value = null, currentPlace, placeDescription;
    // console.log(accordionContents.eq(0).text());
    input.keyup(function( event ) {
      value = input.val().trim().toLowerCase();
      if (value) {
        accordionContents.each(function() {
          currentPlace = jQuery(this);
          placeDescription = currentPlace.text().trim().toLowerCase();
          if (placeDescription.indexOf(value) !== -1) {
            currentPlace.removeClass('hidden');
            showMarkers(placeDescription);
          } else {
            currentPlace.addClass('hidden');
            hideMarkers(placeDescription);
          }
        });
      } else {
        accordionContents.removeClass('hidden');
        markers.forEach(function (t) { t.setMap(map) })
      }
    });
  }

  function init() {
    initMarkers();
    initSearchBar();
  }

  jQuery(document).ready(function () {
    init();
  });
}

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
    var accordionContents = jQuery('.search-view ul li');
    var noResults = jQuery('.no-results');
    var input = jQuery('#mobile-search-bar');
    var value = null, currentPlace, placeDescription, matches;
    // console.log(accordionContents.eq(0).text());
    input.keyup(function( event ) {
      value = input.val().trim().toLowerCase();
      noResults.addClass('hidden');
      if (value) {
        matches = 0;
        accordionContents.each(function() {
          currentPlace = jQuery(this);
          placeDescription = currentPlace.text().trim().toLowerCase();
          if (placeDescription.indexOf(value) !== -1) {
            currentPlace.removeClass('hidden');
            ++matches;
            showMarkers(placeDescription);
          } else {
            currentPlace.addClass('hidden');
            hideMarkers(placeDescription);
          }
        });
        if (matches === 0) {
          noResults.removeClass('hidden');
        }
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

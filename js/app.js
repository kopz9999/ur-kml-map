/*
Impliment changes by Sharjeel Alam: https://www.linkedin.com/in/sharjeelalam/
*/
var countMAp = 0;
var map;
var nav = [];

var markers = [];
var lastinfowindow;
var locIndex;
var infowindow;

//A utility function that translates a given style to an icon
function getIcon(style) {
  switch (style) {
    case "#icon-1753-0288D1":
      return "img/green-atm.png";
    case "baby":
      return "img/ed-baby.png";
    case "#icon-1753-0288D1":
      return "img/green-atm.png";
    case "barbell":
      return "img/blue-barbell.png";
    case "#icon-1519-0288D1":
      return "img/blue-sports.png";
    case "bed":
      return "img/red-bed.png";
    case "#icon-1522-0288D1":
      return "img/purple-bike.png";
    case "bike":
      return "img/blue-bike.png";
    case "#icon-1664-0288d1":
      return "img/lightpurple-book.png";
    case "#icon-1899-DB4436":
      return "img/red-book.png";
    case "#icon-1546-DB4436":
      return "img/red-buildings.png";
    // case "clipboard":
    // return "img/clipboard.png";
    case "coffee":
      return "img/orange-coffee.png";
    case "#icon-1820-0288D1":
      return "img/green-laptop.png";
    case "#icon-1547-0288D1-nodesc":
      return "img/purple-downtown.png";
    case "#icon-1577-0288D1":
      return "img/orange-fastfood.png";
    case "#icon-1577-DB4436":
      return "img/orange-food.png";
    case "#icon-1548-0288D1":
      return "img/purple-pillars.png";
    case "#icon-1646-DB4436":
      return "img/green-health.png";
    case "microscope":
      return "img/purple-science.png";
    //case "minus": return "img/minus.png";
    case "#icon-1548-0288D1":
      return "img/red-music.png";
    case "paint-blue":
      return "img/blue-paint.png";
    case "#icon-1509-0288D1":
      return "img/purple-paint.png";
    case "rcmp":
      return "img/purple-rcmp.png";
    case "running":
      return "img/blue-running.png";
    case "#icon-1685-0288D1":
      return "img/shop-green.png";
    case "shop-orange":
      return "img/orange-retail.png";
    case "#icon-1680-0288D1":
      return "img/blue-sports.png";
    case "#icon-1701-0288D1":
      return "img/blue-swim.png";
    case "tennis":
      return "img/blue-tennis.png";
    case "#icon-1709-0288D1":
      return "img/blue-threatre.png";
    case "ticket":
      return "img/purple-ticket.png";
    case "#icon-1886-0288D1":
      return "img/blue-tree.png";
    case "#icon-1890-0288D1":
      return "img/blue-volley.png";
    default:
      return "img/blue-dot.png";
  }
}

function doFilter() {
  var markersVisible = [];
  if(!locIndex) {
    locIndex = {};
    for(var x=0, len=markers.length; x<len; x++) {
      locIndex[markers[x].locid] = x;
    }
  }

  var checked = $("input[type=checkbox]:checked");
  var selTypes = [];
  for(var i=0, len=checked.length; i<len; i++) {
    selTypes.push($(checked[i]).val());
  }
  for(var i=0, len=nav.length; i<len; i++) {
    var sideDom = "p.loc[data-locid="+(i+1)+"]";

    //Only hide if length != 0
    if(checked.length !=0 && selTypes.indexOf(nav[i].folder) < 0) {
      $(sideDom).hide();
      markers[locIndex[i+1]].setVisible(false);
    } else {
      $(sideDom).show();
      markers[locIndex[i+1]].setVisible(true);
      markersVisible.push(locIndex[i+1]);
    }
  }
  console.log( nav.length + " "+  markersVisible.length )
  if ( nav.length == markersVisible.length){
    $("#accordion-all").prop('checked', true );
  }
  else { $("#accordion-all").prop('checked', false );  }

}

$(function() {

//toggle side nav
  $(".sidenav-toggle").click(function() {
    $(".uofrmap-sidenav").toggleClass("active");
  });

//initialise a map

  init();

// pull from locally hosted copy for access to data

  $.get("map/map.kml", function(data) {

    html = "";
    showall = "";

    function convertToSlug(Text) {
      return Text
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
    }

//loop through folders

    $(data).find("Folder").each(function(index, value) {

      folder = $(this).find("name").eq(0).text();

      if (index === 0 || $(this).find("name").eq(0).text() !== comparefolder) {
        accordion = "<div class=\"accordion " + convertToSlug(folder) + "\"><input value=\"" + convertToSlug(folder) + "\"  id=\"" + convertToSlug(folder) + "\" type=\"checkbox\"  name=\"accordions\"><label for=\"" + convertToSlug(folder) + "\">" + folder + "</label><div class=\"accordion-content\"><ul></ul></div></div>";
        $(".uofrmap-sidenav").append(accordion);
      }
//use to compare if first instance
      comparefolder = folder;

    })
    mymarkers = "";

    var length = $(data).find("Placemark").length;

// loop through placemarks tags
    $(data).find("Placemark").each(function(index, value) {

      folder = $(this).parent().find("name").eq(0).text();
// console.log(folder);

//get coordinates and place name
      coords = $(this).find("coordinates").text();
// console.log(coords);

      place = $(this).find("name").text();
// console.log(place);

      style = $(this).find("styleUrl").text();
// console.log(style);

//store as JSON
      c = coords.split(",")
      nav.push({
        "place": place.trim(),
        "lng": c[0].trim(),
        "lat": c[1].trim(),
        'folder': convertToSlug(folder),
        "style": style.trim()
      })
//output as a navigation
      html = "<li class=\"" + convertToSlug(style) + "\"><img src=\"" + getIcon(style.type) + "\" alt=\"" + place + "\">" + place + "</li>";


      showall += "<li class=\"" + convertToSlug(style) + "\"><img src=\"" + getIcon(style.type) + "\" alt=\"" + place + "\">" + place + "</li>";


//add places to category
      $(".accordion." + convertToSlug(folder) + " ul").append(html);

      thisVal = $(this).val();
      if (parseInt(thisVal) !== 0) {
        //valid loop
        mymarkers += "{lat:'" + c[0] + "', long:'" + c[1] + "', title:'" + place + "', type:'" + convertToSlug(folder) + "', style:'" + style + "'},";
        // console.log('Valid Field: ' + thisVal);

        if (index === (length - 1)) {
          //lastloop

          mymarkers += "{lat:'" + c[0] + "', long:'" + c[1] + "', title:'" + place + "', type:'" + convertToSlug(folder) + "', style:'" + style + "'}";


        }
      }

    })

//add places to all
    $(".accordion.all ul").append(showall);


//bind clicks on your navigation to scroll to a placemark

    $("input[type=checkbox]").bind("click", function() {
      console.log( $(this).val()  + "  " +  $(this).is(':checked') );
      if ( $(this).val() == 'accordion-all'){
        var returnR = false;
        if (!$(this).is(':checked')) {
          returnR = true;
        }
        else{
          returnR = false;
        }
        $("input[type=checkbox]").prop('checked', false );
        $(this).prop('checked', returnR );
      }
      doFilter();
    })



    if (!Array.prototype.forEach) {
      Array.prototype.forEach = function(fn, scope) {
        for (var i = 0, len = this.length; i < len; ++i) {
          fn.call(scope, this[i], i, this);
        }
      }
    }


    /*
    This is the data as a JS array. .
    */

    var data = [mymarkers];

//geocoder = new google.maps.Geocoder();
    /* */

    setTimeout(function() {

      nav.forEach(function(mapData,idx) {

        /* */
        var geocoder  = new google.maps.Geocoder();             // create a geocoder object
        var location  = new google.maps.LatLng(parseFloat(mapData.lat), parseFloat(mapData.lng));    // turn coordinates into an object

        var icon = {
          url: getIcon(mapData.style),
          scaledSize: new google.maps.Size(30, 35), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        };

        var marker = new google.maps.Marker({
          map: map,
          position: location,
          title: mapData.place,
          icon: icon,
          optimized: true
        });
        var contentHtml = "<div style='width:300px;height:200px'><h3>"+mapData.place+"</h3>"+mapData.place+"</div>";
        var infowindow = new google.maps.InfoWindow({
          content: contentHtml
        });
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
        });
        marker.locid = idx+1;
        marker.infowindow = infowindow;
        markers[markers.length] = marker;

        var sideHtml = '<p class="loc" data-locid="'+marker.locid+'"><b>'+mapData.place+'</b><br/>';
        sideHtml += mapData.place + '</p>';
//$("#locs").append(sideHtml);

        countMAp = countMAp + 1;


// NAv loop
        /* */
      });
      setUpSearchBar(jQuery, map, markers);
      /* */
    }, 200);

//A utility function that translates a given style to an icon
    function getIcon(style) {
      switch (style) {
        case "#icon-1753-0288D1":
          return "img/green-atm.png";
        case "baby":
          return "img/ed-baby.png";
        case "#icon-1753-0288D1":
          return "img/green-atm.png";
        case "barbell":
          return "img/blue-barbell.png";
        case "#icon-1519-0288D1":
          return "img/blue-sports.png";
        case "bed":
          return "img/red-bed.png";
        case "#icon-1522-0288D1":
          return "img/purple-bike.png";
        case "bike":
          return "img/blue-bike.png";
        case "#icon-1664-0288d1":
          return "img/lightpurple-book.png";
        case "#icon-1899-DB4436":
          return "img/red-book.png";
        case "#icon-1546-DB4436":
          return "img/red-buildings.png";
        // case "clipboard":
        // return "img/clipboard.png";
        case "coffee":
          return "img/orange-coffee.png";
        case "#icon-1820-0288D1":
          return "img/green-laptop.png";
        case "#icon-1547-0288D1-nodesc":
          return "img/purple-downtown.png";
        case "#icon-1577-0288D1":
          return "img/orange-fastfood.png";
        case "#icon-1577-DB4436":
          return "img/orange-food.png";
        case "#icon-1548-0288D1":
          return "img/purple-pillars.png";
        case "#icon-1646-DB4436":
          return "img/green-health.png";
        case "microscope":
          return "img/purple-science.png";
        //case "minus": return "img/minus.png";
        case "#icon-1548-0288D1":
          return "img/red-music.png";
        case "paint-blue":
          return "img/blue-paint.png";
        case "#icon-1509-0288D1":
          return "img/purple-paint.png";
        case "rcmp":
          return "img/purple-rcmp.png";
        case "running":
          return "img/blue-running.png";
        case "#icon-1685-0288D1":
          return "img/shop-green.png";
        case "shop-orange":
          return "img/orange-retail.png";
        case "#icon-1680-0288D1":
          return "img/blue-sports.png";
        case "#icon-1701-0288D1":
          return "img/blue-swim.png";
        case "tennis":
          return "img/blue-tennis.png";
        case "#icon-1709-0288D1":
          return "img/blue-threatre.png";
        case "ticket":
          return "img/purple-ticket.png";
        case "#icon-1886-0288D1":
          return "img/blue-tree.png";
        case "#icon-1890-0288D1":
          return "img/blue-volley.png";
        default:
          return "img/blue-dot.png";
      }
    }
  });

  if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(fn, scope) {
      for (var i = 0, len = this.length; i < len; ++i) {
        fn.call(scope, this[i], i, this);
      }
    }
  }

  function init() {
    var latlng = new google.maps.LatLng(50.417013, -104.588490);
    var myOptions = {
      zoom: 16,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map"), myOptions);

    infoWindow = new google.maps.InfoWindow;
  }

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }

});
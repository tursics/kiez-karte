/*
*/

var map = null;
var showWelcome = false;

// -----------------------------------------------------------------------------
/*
Spielplatzbestand Berlin
Karte, 1:1.000 
nutzIII.pdf
http://fbinter.stadt-berlin.de/fb/gisbroker.do;jsessionid=8327EAA7A1442FD8EA33B1D195F90868?cmd=navigationShowResult&mid=K.gris_spielplatz%40senstadt

Spielplatzversorgung - öffentlich
Karte, 1:5.000 
Nutzungsbedingungen noch nicht abschließend formuliert
http://fbinter.stadt-berlin.de/fb/gisbroker.do;jsessionid=8327EAA7A1442FD8EA33B1D195F90868?cmd=navigationShowResult&mid=K.spielver_oeff%40senstadt

Spielplatzversorgung - öffentlich und privat
Karte, 1:5.000 
Nutzungsbedingungen noch nicht abschließend formuliert
http://fbinter.stadt-berlin.de/fb/gisbroker.do;jsessionid=8327EAA7A1442FD8EA33B1D195F90868?cmd=navigationShowResult&mid=K.spielver_oeffpriv%40senstadt

Spielplatzbestand Berlin
Sachdaten, 1845 Daten
nutzIII.pdf
http://fbinter.stadt-berlin.de/fb/gisbroker.do;jsessionid=8327EAA7A1442FD8EA33B1D195F90868?cmd=navigationShowResult&mid=S.s_spielplatz%40senstadt
http://fbinter.stadt-berlin.de/fb/wfs/geometry/senstadt/re_spielplatz?REQUEST=GetCapabilities&SERVICE=WFS&VERSION=1.1.0

Spielplatzversorgung - öffentlich / PLR
Sachdaten, 438 Daten
Nutzungsbedingungen noch nicht abschließend formuliert
http://fbinter.stadt-berlin.de/fb/gisbroker.do;jsessionid=8327EAA7A1442FD8EA33B1D195F90868?cmd=navigationShowResult&mid=S.s_spielver_oe_plr%40senstadt

Spielplatzversorgung - öffentlich / VE
Sachdaten, 1354 Daten
Nutzungsbedingungen noch nicht abschließend formuliert
http://fbinter.stadt-berlin.de/fb/gisbroker.do;jsessionid=8327EAA7A1442FD8EA33B1D195F90868?cmd=navigationShowResult&mid=S.s_spielver_oe_ve%40senstadt

Spielplatzversorgung - öffentlich und privat / PLR
Sachdaten, 438 Daten
Nutzungsbedingungen noch nicht abschließend formuliert
http://fbinter.stadt-berlin.de/fb/gisbroker.do;jsessionid=8327EAA7A1442FD8EA33B1D195F90868?cmd=navigationShowResult&mid=S.s_spielver_oepr_plr%40senstadt

Spielplatzversorgung - öffentlich und privat / VE
Sachdaten, 1354 Daten
Nutzungsbedingungen noch nicht abschließend formuliert
http://fbinter.stadt-berlin.de/fb/gisbroker.do;jsessionid=8327EAA7A1442FD8EA33B1D195F90868?cmd=navigationShowResult&mid=S.s_spielver_oepr_ve%40senstadt

*/
// -----------------------------------------------------------------------------

function initNokiaMap( elementName, lat, lng, zoom)
{
	// test key for
	// url: http://tursics.de/sample/lichtenberg
	// until: 2014-06-27
	nokia.Settings.set( 'app_id', 'R69qfu8j1eZyNk50CekA');
	nokia.Settings.set( 'app_code', '6GwB7JeP2QyKOEUy911pZw');

	map = new nokia.maps.map.Display(
		document.getElementById( elementName), {
			components: [
				new nokia.maps.map.component.Behavior(),
				new nokia.maps.map.component.ZoomBar(),
//				new nokia.maps.map.component.TypeSelector(),
				// ScaleBar Overview ZoomRectangle Positioning ContextMenu InfoBubbles PublicTransport Traffic
			],
			zoomLevel: zoom,
			center: [lat, lng],
			baseMapType: nokia.maps.map.Display.NORMAL // NORMAL NORMAL_COMMUNITY SATELLITE SATELLITE_COMMUNITY  SMARTMAP SMART_PT TERRAIN TRAFFIC
	});
//	map.removeComponent( map.getComponentById( "zoom.MouseWheel"));
}

// -----------------------------------------------------------------------------

$( document).on( "pagecreate", "#pageMap", function()
{
	// center the city hall
	initNokiaMap( 'mapContainer', 52.515807, 13.479470, 16);

	$( '#displayBaby').on( 'click', function( e) {
		setAge( 0);
	});
	$( '#displayChild').on( 'click', function( e) {
		setAge( 6);
	});
	$( '#displayPregnant').on( 'click', function( e) {
		setAge( 18);
	});
	$( '#displayAdult').on( 'click', function( e) {
		setAge( 30);
	});
	$( '#displaySenior').on( 'click', function( e) {
		setAge( 65);
	});

	$( '#displayNormal').on( 'click', function( e) {
		map.setBaseMapType( map.NORMAL, 'default');
	});
	$( '#displaySatelite').on( 'click', function( e) {
		map.setBaseMapType( map.SATELLITE, 'default');
	});
	$( '#displayCar').on( 'click', function( e) {
		map.setBaseMapType( map.TRAFFIC, 'default');
	});
	$( '#displayBus').on( 'click', function( e) {
		map.setBaseMapType( map.SMART_PT, 'default');
	});

	initDragnDrop();

//	var marker1 = new nokia.maps.map.StandardMarker([52.515807, 13.479470], {
//		text: "Hi"
//	});
//	map.objects.add( marker1);

//	var marker2 = new nokia.maps.map.Marker(
//		new nokia.maps.geo.Coordinate(52.515, 13.481), {
//			title: "marker",
//			visibility: true,
//			icon: "images/pin_restaurant.png",
//			anchor: new nokia.maps.util.Point(16, 36)
//		}
//	);
//	map.objects.add( marker2);

/*	map.objects.add( new nokia.maps.map.Circle(
		[52.51, 13.49],
		500,
		{
			pen: {
				strokeColor: "#C22A",
				lineWidth: 2
			},
			brush: {
				color: "#0FF6"
			}
		}
	));*/

	setAge( 30);

//	showWelcome = true;
});

// -----------------------------------------------------------------------------

$( document).on( "pageshow", "#pageMap", function()
{
	if( showWelcome) {
		showWelcome = false;
		$( '#welcomeClose').on( 'click', function( e) {
			$( '#popupWelcome').popup( 'close');
		});
		$( '#popupWelcome').popup( 'open');
	}
});

// -----------------------------------------------------------------------------

/*function sample1()
{
	setTimeout( function () {
		function onTransitionFinished1() {
			map.removeListener( "transitionend", onTransitionFinished1);

			sample2();
		}

		map.addListener( "transitionend", onTransitionFinished1);
		map.setZoomLevel( 15, 'default');
	}, 1000);
}*/

// -----------------------------------------------------------------------------

/*function sample2()
{
	setTimeout( function () {
		function onTransitionFinished2() {
			map.removeListener( "basemapchangeend", onTransitionFinished2);

			sample3();
		}

		map.addListener( "basemapchangeend", onTransitionFinished2);
		map.setBaseMapType( map.SMART_PT, 'default');
	}, 1000);
}*/

// -----------------------------------------------------------------------------

/*function sample3()
{
	setTimeout( function () {
		function onTransitionFinished3() {
			map.removeListener( "basemapchangeend", onTransitionFinished3);

			sample4();
		}

		map.addListener( "basemapchangeend", onTransitionFinished3);
		map.setBaseMapType( map.SATELLITE, 'default', {
			latitude: 52.515,
			longitude: 13.481,
			zoom: 16
		});
	}, 1000);
}*/

// -----------------------------------------------------------------------------

/*function sample4()
{
	// http://developer.here.com/javascript-apis/documentation/maps/topics/overlays.html
	// http://heremaps.github.io/examples/explorer.html#find-user-address
}*/

// -----------------------------------------------------------------------------

/*function geocode( term)
{
	nokia.places.search.manager.geoCode({
		searchTerm: term,
		onComplete: geocodeResults
	});
}*/

// -----------------------------------------------------------------------------

/*var geocodeResultSet;
var geocodeResults = function( data, requestStatus, requestId)
{
	var i, len, locations, marker;

	if( requestStatus == "OK") {
		locations = data.results ? data.results.items : [data.location];
		if( locations.length > 0) {
			if( geocodeResultSet) {
				map.objects.remove( geocodeResultSet);
			}

			geocodeResultSet = new nokia.maps.map.Container();
			for( i = 0, len = locations.length; i < len; ++i) {
				marker = new nokia.maps.map.StandardMarker( locations[i].position, { text: i+1 });
				geocodeResultSet.objects.add( marker);
			}

			map.objects.add( geocodeResultSet);
//			map.zoomTo( geocodeResultSet.getBoundingBox(), false);
		} else { 
			alert( "Your search produced no results!");
		}
	} else {
		alert( "The search request failed");
	}
};*/

// -----------------------------------------------------------------------------

function setAge( age)
{
	$( '#displayBaby').prop( 'checked', false);
	$( '#displayChild').prop( 'checked', false);
	$( '#displayPregnant').prop( 'checked', false);
	$( '#displayAdult').prop( 'checked', false);
	$( '#displaySenior').prop( 'checked', false);

	var str = '';
	str += '<div>';
	if( age < 6) {
		$( '#displayBaby').prop( 'checked', true).checkboxradio( 'refresh');
		str += '<i class="fa fa-bug" style="padding-right:0.7em;"></i>Angebote für Babys und Kleinkinder<br>';
	} else if( age < 18) {
		$( '#displayChild').prop( 'checked', true).checkboxradio( 'refresh');
		str += '<i class="fa fa-child" style="padding-right:0.7em;"></i>Angebote für Schulkinder<br>';
	} else if( age < 30) {
		$( '#displayPregnant').prop( 'checked', true).checkboxradio( 'refresh');
		str += '<i class="fa fa-female" style="padding-right:0.7em;"></i>Angebote für die Familienplanung<br>';
	} else if( age < 65) {
		$( '#displayAdult').prop( 'checked', true).checkboxradio( 'refresh');
		str += '<i class="fa fa-male" style="padding-right:0.7em;"></i>Angebote für Familien<br>';
	} else {
		$( '#displaySenior').prop( 'checked', true).checkboxradio( 'refresh');
		str += '<i class="fa fa-wheelchair" style="padding-right:0.7em;"></i>Angebote für ältere Bürger<br>';
	}
	$( '#displayBaby').checkboxradio( 'refresh'); 
	$( '#displayChild').checkboxradio( 'refresh'); 
	$( '#displayPregnant').checkboxradio( 'refresh'); 
	$( '#displayAdult').checkboxradio( 'refresh'); 
	$( '#displaySenior').checkboxradio( 'refresh'); 

	str += '</div>';
	str += '<ul data-role="listview" data-inset="false" id="ageList">';

	var ageStr = 'age' + age;
	for( var i = 0; i < dataVec.length; ++i) {
		if( dataVec[i][ageStr].length > 0) {
			str += '<li><a href="#" onClick="onShowData(' + i + ');" border=0><i class="fa ' + dataVec[i].icon + '"></i> ' + dataVec[i][ageStr] + '</a></li>';
		}
	}

	str += '</ul>';

	$( '#mapSelectInfo').html( str);
	$( '#ageList').listview();
}

// -----------------------------------------------------------------------------

var dataGeoSet = null;

function onShowData( dataId)
{
	if( dataId < dataVec.length) {
		if( dataGeoSet) {
			map.objects.remove( dataGeoSet);
		}
		dataGeoSet = new nokia.maps.map.Container();
		map.objects.add( dataGeoSet);

		$.getJSON( 'data/' + dataVec[ dataId].url, function( data) {
			try {
				$.each( data, function( key, val) {
					if((typeof val.lat != 'undefined') && (typeof val.lng != 'undefined')) {
						marker = new nokia.maps.map.StandardMarker([parseFloat( val.lat), parseFloat( val.lng)]);
						dataGeoSet.objects.add( marker);
					}
				});

				if( dataGeoSet.objects.getLength() > 0) {
					map.zoomTo( dataGeoSet.getBoundingBox(), false);
				}
			} catch( e) {
				alert( e);
			}
		});
	}
}

// -----------------------------------------------------------------------------
//	map.addListener( "basemapchangestart", function () {});
//	map.addListener( "basemapchangeend", function () {});
// -----------------------------------------------------------------------------

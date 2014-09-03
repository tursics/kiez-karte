/*
*/

var map = null;
var showWelcome = false;

var dataAge = -1;
var dataGeoSet = new Array();

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

	updateMapSelectData();

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

function updateMapSelectData()
{
	var str = '';

	if( dataGeoSet.length > 0) {
		str += '<ul data-role="listview" data-inset="false" data-split-icon="minus" data-split-theme="d" id="mapSelectDataList">';
		for( var i = 0; i < dataGeoSet.length; ++i) {
			var idx = dataGeoSet[ i].id;
			var ageStr = 'age' + dataGeoSet[ i].age;
			str += '<li><a href="#" border=0><i class="fa ' + dataVec[idx].icon + '"></i> ' + dataVec[idx][ageStr] + '</a>';
			str += '<a href="#" onClick="onRemoveData(' + i + ');" border=0>Entfernen</a></li>';
		}
		str += '</ul>';
	} else {
		if( dataAge >= 0) {
			str += '<div id="mapSelectDataEmpty"><i class="fa fa-hand-o-up" style="color:#155764;"></i> Wähle ein Thema aus</div>';
		} else {
			str += '<div id="mapSelectDataEmpty"><i class="fa fa-hand-o-up" style="color:#155764;"></i> Benutze das Menü links oben!</div>';
		}
	}

	$( '#mapSelectData').html( str);
	$( '#mapSelectDataList').listview();
}

// -----------------------------------------------------------------------------

function updateMapSelectItem( data)
{
	var str = '';
	var strH2 = '';
	var strAddr = '';
	var strPhone = [];
	var strNet = [];
	var strInfo = '';

	if( typeof data.einrichtung !== 'undefined') {
		strH2 = data.einrichtung;
	}

	if( typeof data.strasse !== 'undefined') {
		strAddr += data.strasse + '<br>';
	}
	if( typeof data.plz_ort !== 'undefined') {
		strAddr += data.plz_ort + '<br>';
	}

	if( typeof data.telefon !== 'undefined') {
		strPhone.push( data.telefon);
	}

	if( typeof data.webadressen !== 'undefined') {
		strNet.push( data.webadressen);
	}

	if( typeof data.nutzung !== 'undefined') {
		strInfo += 'Nutzung: ' + data.nutzung + '<br>';
	}
	if( typeof data.quadratmeter !== 'undefined') {
		strInfo += 'Größe: ' + data.quadratmeter + '<br>';
	}
	if( typeof data.ausstattung !== 'undefined') {
		strInfo += 'Ausstattung: ' + data.ausstattung + '<br>';
	}
	if( typeof data.kosten !== 'undefined') {
		strInfo += 'Kosten: ' + data.kosten + '<br>';
	}

	if( strH2 != '') {
		str += '<h2>' + strH2 + '</h2>';
	}
	if( strAddr != '') {
		str += '<div style="padding:0 0 .5em 0;">' + strAddr + '</div>';
	}
	if( strPhone.length > 0) {
		for( i = 0; i < strPhone.length; ++i) {
			var phoneVec = strPhone[i].split( ',');
			for( j = 0; j < phoneVec.length; ++j) {
				var isFax = false;
				phoneVec[j] = phoneVec[j].trim();
				if( 'Telefon: ' == phoneVec[j].substring( 0, 9)) {
					phoneVec[j] = phoneVec[j].substring( 9);
				} else if( 'Mobil: ' == phoneVec[j].substring( 0, 7)) {
					phoneVec[j] = phoneVec[j].substring( 7);
				} else if( 'Telefax: ' == phoneVec[j].substring( 0, 9)) {
					phoneVec[j] = phoneVec[j].substring( 9);
					isFax = true;
				}

				if( isFax) {
					str += '<div><div class="round round-fax"><i class="fa fa-fax"></i></div> ' + phoneVec[j] + '</div>';
				} else {
					str += '<div><div class="round round-phone"><i class="fa fa-phone"></i></div> ' + phoneVec[j] + '</div>';
				}
			}
		}
	}
	if( strNet.length > 0) {
		for( i = 0; i < strNet.length; ++i) {
			var netVec = strNet[i].split( ' ');
			for( j = 0; j < netVec.length; ++j) {
				var isMail = false;

				if( netVec[j].indexOf( '@') > 0) {
					isMail = true;
				}

				if( isMail) {
					str += '<div><div class="round round-envelope"><i class="fa fa-envelope"></i></div> <a href="mailto:' + netVec[j] + '">' + netVec[j] + '</a></div>';
				} else {
					str += '<div><div class="round round-envelope"><i class="fa fa-envelope"></i></div> <a href="mailto:' + netVec[j] + '">' + netVec[j] + '</a></div>';
				}
			}
		}
	}
	if( strInfo != '') {
		str += '<div class="info">' + strInfo + '</div>';
	}

//	str += JSON.stringify( data);
	console.log( data);

	$( '#mapSelectItem').html( str);
}

// -----------------------------------------------------------------------------

function updateMapSelectInfo()
{
	var str = '';

	if( dataAge >= 0) {
		str += '<div>';
		if( dataAge < 6) {
			str += '<i class="fa fa-bug" style="padding-right:0.7em;"></i>Angebote für Babys und Kleinkinder<br>';
		} else if( dataAge < 18) {
			str += '<i class="fa fa-child" style="padding-right:0.7em;"></i>Angebote für Schulkinder<br>';
		} else if( dataAge < 30) {
			str += '<i class="fa fa-female" style="padding-right:0.7em;"></i>Angebote für die Familienplanung<br>';
		} else if( dataAge < 65) {
			str += '<i class="fa fa-male" style="padding-right:0.7em;"></i>Angebote für Familien<br>';
		} else {
			str += '<i class="fa fa-wheelchair" style="padding-right:0.7em;"></i>Angebote für ältere Bürger<br>';
		}

		str += '</div>';
		str += '<ul data-role="listview" data-inset="false" data-icon="plus" id="mapSelectInfoList">';

		var ageStr = 'age' + dataAge;
		for( var i = 0; i < dataVec.length; ++i) {
			if( dataVec[i][ageStr].length > 0) {
				str += '<li><a href="#" onClick="onShowData(' + i + ',' + dataAge + ');" border=0><i class="fa ' + dataVec[i].icon + '"></i> ' + dataVec[i][ageStr] + '</a></li>';
			}
		}

		str += '</ul>';
	}

	$( '#mapSelectInfo').html( str);
	$( '#mapSelectInfoList').listview();
}

// -----------------------------------------------------------------------------

function setAge( age)
{
	if( dataAge != age) {
		dataAge = age;
	} else {
		dataAge = -1;
	}

	updateMapSelectInfo();
	updateMapSelectData();
}

// -----------------------------------------------------------------------------

function onShowData( dataId, ageId)
{
	if( dataId < dataVec.length) {
		var TOUCH = nokia.maps.dom.Page.browser.touch;
		var CLICK = TOUCH ? 'tap' : 'click';
		var colorOut = {color: '#155764'};
		var colorOver = {color: '#8C9C88'};

		setAge( -1);

		for( var i = 0; i < dataGeoSet.length; ++i) {
			if( dataId == dataGeoSet[ i].id) {
				dataGeoSet[ i].age = ageId;
				dataGeoSet.push( dataGeoSet[ i]);
				dataGeoSet.splice( i, 1);

				updateMapSelectData();
				return;
			}
		}

		dataGeoSet.push({
			id: dataId,
			age: ageId,
			container: new nokia.maps.map.Container()
		});

		var container = dataGeoSet[ dataGeoSet.length - 1].container;

		container.addListener( CLICK, function( evt) {
			updateMapSelectItem( evt.target.data);
		}, false);
		container.addListener( 'mouseover', function( evt) {
			evt.target.set( 'brush', colorOver);
			map.update( -1, 0);
		}, false);
		container.addListener( 'mouseout', function( evt) {
			evt.target.set( 'brush', colorOut);
			map.update( -1, 0);
		}, false);
		map.objects.add( container);

		updateMapSelectData();

		$.getJSON( 'data/' + dataVec[ dataId].url, function( data) {
			try {
				$.each( data, function( key, val) {
					if((typeof val.lat != 'undefined') && (typeof val.lng != 'undefined')) {
						marker = new nokia.maps.map.StandardMarker([parseFloat( val.lat), parseFloat( val.lng)], {
							brush: colorOut,
							data: val
						});
						container.objects.add( marker);
					}
				});

				if( container.objects.getLength() > 0) {
					map.zoomTo( container.getBoundingBox(), false);
				}
			} catch( e) {
//				alert( e);
			}
		});
	}
}

// -----------------------------------------------------------------------------

function onRemoveData( dataId)
{
	if( dataId < dataGeoSet.length) {
		map.objects.remove( dataGeoSet[ dataId].container);
		dataGeoSet.splice( dataId, 1);
	}

	setAge( -1);
	updateMapSelectData();
}

// -----------------------------------------------------------------------------
//	map.addListener( "basemapchangestart", function () {});
//	map.addListener( "basemapchangeend", function () {});
// -----------------------------------------------------------------------------

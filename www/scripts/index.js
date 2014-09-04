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

function formatDate( strDate)
{
	var month = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
	var strD = '1';
	var strM = '1';
	var strY = '2001';

	var vec = strDate.trim().split( '-');
	if( vec.length == 3) {
		strD = vec[ 2];
		strM = vec[ 1];
		strY = vec[ 0];
	} else {
		vec = strDate.trim().split( '.');
		if( vec.length == 3) {
			strD = vec[ 0];
			strM = vec[ 1];
			strY = vec[ 2];
		}
	}

	var obj = new Date( parseInt( strY), parseInt( strM) - 1, parseInt( strD), 0, 0, 0, 0);
	return obj.getDate() + '. ' + month[ obj.getMonth()] + ' ' + obj.getFullYear();
}

// -----------------------------------------------------------------------------

function trimQuotes( str)
{
	if(( str.indexOf( "'") == 0) && (str.lastIndexOf( "'") == (str.length - 1))) {
		return str.substring( 1, str.length - 1);
	}
	return str;
}

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
	var strInfo = '';
	var arrayPhone = [];
	var arrayNet = [];

	if( typeof data.einrichtung !== 'undefined') {
		// wirtschaft-mietraum.show.json
		// freizeit-sport-jfe.show.json
		strH2 = data.einrichtung;
	} else if( typeof data.name !== 'undefined') {
		// buergerservice-aerzte-foo.show.json
		// maerkte-xmas.show.json
		// buergerservice-familie-tagespflege.show.json
		// re-spielplatz.foo.show.json
		strH2 = data.name;

		if(( typeof data.name2 !== 'undefined') && (data.name2 != '')){
			// re-spielplatz.foo.show.json
			strH2 += ' ' + data.name2;
		}
	} else if( typeof data.bezeichnung !== 'undefined') {
		// maerkte-strassenfeste.show.json
		strH2 = data.bezeichnung;
	} else if( typeof data.projekt !== 'undefined') {
		// freizeit-sport-ja-jsa.show.json
		strH2 = data.projekt;
	} else if( typeof data.location !== 'undefined') {
		// maerkte-wochen-antik.show.json
		strH2 = data.location;
	} else if( typeof data.baumartdt !== 'undefined') {
		// stadtbaum-baumstandort-20140508.show.json
		strH2 = trimQuotes( data.baumartdt);
	}

	if( typeof data.strasse !== 'undefined') {
		data.strasse = trimQuotes( data.strasse);
		if( typeof data.hausnr !== 'undefined') {
			strAddr += data.strasse + ' ' + trimQuotes( data.hausnr) + '<br>';
		} else {
			strAddr += data.strasse + '<br>';
		}
	}
	if( typeof data.anschrift !== 'undefined') {
		strAddr += data.anschrift + '<br>';
	}
	if( typeof data.plz_ort !== 'undefined') {
		strAddr += data.plz_ort + '<br>';
	} else if( typeof data.plz !== 'undefined') {
		strAddr += trimQuotes( data.plz) + ' Berlin<br>';
	}

	if(( typeof data.telefon !== 'undefined') && (data.telefon != '')) {
		arrayPhone.push( data.telefon);
	}

	if( typeof data.webadressen !== 'undefined') {
		arrayNet.push( data.webadressen);
	}
	if( typeof data.mail !== 'undefined') {
		arrayNet.push( data.mail);
	}
	if( typeof data.email !== 'undefined') {
		arrayNet.push( data.email);
	}
	if( typeof data.e_mail !== 'undefined') {
		arrayNet.push( data.e_mail);
	}
	if( typeof data.e_mail2 !== 'undefined') {
		arrayNet.push( data.e_mail2);
	}
	if( typeof data.internet !== 'undefined') {
		arrayNet.push( data.internet);
	}
	if( typeof data.www !== 'undefined') {
		arrayNet.push( data.www);
	}
	if( typeof data.w3 !== 'undefined') {
		arrayNet.push( data.w3);
	}

	// buergerservice-familie-sbst.show.json
	// heimaufsicht-pruefberichte.show.json
	// re-friedh.show.json
	if( typeof data.nutzung !== 'undefined') {
		// wirtschaft-mietraum.show.json
		strInfo += 'Nutzung: ' + data.nutzung + '<br>';
	}
	if( typeof data.quadratmeter !== 'undefined') {
		// wirtschaft-mietraum.show.json
		strInfo += 'Größe: ' + data.quadratmeter + '<br>';
	}
	if( typeof data.ausstattung !== 'undefined') {
		// wirtschaft-mietraum.show.json
		strInfo += 'Ausstattung: ' + data.ausstattung + '<br>';
	}
	if( typeof data.kosten !== 'undefined') {
		// wirtschaft-mietraum.show.json
		strInfo += 'Kosten: ' + data.kosten + '<br>';
	}
	if( typeof data.fachrichtung !== 'undefined') {
		// buergerservice-aerzte-foo.show.json
		strInfo += 'Arzt für ' + data.fachrichtung + '<br>';
	}
	if(( typeof data._strasse_ !== 'undefined') && (data._strasse_ != '')) {
		// maerkte-strassenfeste.show.json
		// maerkte-xmas.show.json
		strInfo += data._strasse_ + '<br>';
	}
	if(( typeof data.bemerkungen !== 'undefined') && (data.bemerkungen != '')) {
		// maerkte-strassenfeste.show.json
		// maerkte-wochen-antik.show.json
		strInfo += 'Bemerkungen: ' + data.bemerkungen + '<br>';
	}
	if(( typeof data.von !== 'undefined') && (data.von != '') && (typeof data.bis !== 'undefined') && (data.bis != '') && (formatDate( data.von) == formatDate( data.bis))) {
		// maerkte-strassenfeste.show.json
		// maerkte-xmas.show.json
		strInfo += 'am ' + formatDate( data.von) + '<br>';
	} else {
		if(( typeof data.von !== 'undefined') && (data.von != '')) {
			// maerkte-strassenfeste.show.json
			// maerkte-xmas.show.json
			strInfo += 'vom ' + formatDate( data.von) + '<br>';
		}
		if(( typeof data.bis !== 'undefined') && (data.bis != '')) {
			// maerkte-strassenfeste.show.json
			// maerkte-xmas.show.json
			strInfo += 'bis ' + formatDate( data.bis) + '<br>';
		}
	}
	if(( typeof data.tage !== 'undefined') && (data.tage != '')) {
		// maerkte-wochen-antik.show.json
		strInfo += 'am ' + data.tage + '<br>';
	}
	if(( typeof data.zeit !== 'undefined') && (data.zeit != '')){
		// maerkte-strassenfeste.show.json
		strInfo += 'um ' + data.zeit + '<br>';
	}
	if(( typeof data.zeiten !== 'undefined') && (data.zeiten != '')){
		// maerkte-wochen-antik.show.json
		strInfo += 'von ' + data.zeiten + '<br>';
	}
	if(( typeof data.oeffnungszeiten !== 'undefined') && (data.oeffnungszeiten != '')){
		// maerkte-xmas.show.json
		strInfo += 'von ' + data.oeffnungszeiten + '<br>';
	}
	if( typeof data.veranstalter !== 'undefined') {
		// maerkte-strassenfeste.show.json
		// maerkte-xmas.show.json
		strInfo += 'Veranstalter: ' + data.veranstalter + '<br>';
	}
	if( typeof data.betreiber !== 'undefined') {
		// maerkte-wochen-antik.show.json
		strInfo += data.betreiber + '<br>';
	}
	if(( typeof data.kinderzahl !== 'undefined') && (data.kinderzahl != '')){
		// buergerservice-familie-tagespflege.show.json
		strInfo += 'Kinder: ' + data.kinderzahl + '<br>';
	}
	if(( typeof data.spiel_art !== 'undefined') && (data.spiel_art != '')){
		// re-spielplatz.foo.show.json
		strInfo += data.spiel_art + '<br>';
	}
	if(( typeof data.baujahr !== 'undefined') && (data.baujahr != '')){
		// re-spielplatz.foo.show.json
		strInfo += 'Baujahr: ' + data.baujahr + '<br>';
	}
	if(( typeof data.sanierung !== 'undefined') && (data.sanierung != '')){
		// re-spielplatz.foo.show.json
		strInfo += 'Sanierung: ' + data.sanierung + '<br>';
	}
	if(( typeof data.groesse !== 'undefined') && (data.groesse != '')){
		// re-spielplatz.foo.show.json
		strInfo += 'Größe: ' + data.groesse + 'm²<br>';
	}
	if(( typeof data.spiel_fl !== 'undefined') && (data.spiel_fl != '')){
		// re-spielplatz.foo.show.json
		strInfo += 'Spielfläche: ' + data.spiel_fl + 'm²<br>';
	}
	if(( typeof data.schule !== 'undefined') && (data.schule != '')){
		// freizeit-sport-ja-jsa.show.json
		strInfo += 'Schule: ' + data.schule + '<br>';
	}
	if(( typeof data.schultyp !== 'undefined') && (data.schultyp != '')){
		// freizeit-sport-ja-jsa.show.json
		strInfo += 'Schultyp: ' + data.schultyp + '<br>';
	}
	if(( typeof data.traeger !== 'undefined') && (data.traeger != '')){
		// freizeit-sport-ja-jsa.show.json
		// freizeit-sport-jfe.show.json
		strInfo += 'Träger: ' + data.traeger + '<br>';
	}
	if(( typeof data.angebote !== 'undefined') && (data.angebote != '')){
		// freizeit-sport-ja-jsa.show.json
		// freizeit-sport-jfe.show.json
		strInfo += 'Angebote: ' + data.angebote + '<br>';
	}
	if(( typeof data.baumartbot !== 'undefined') && (data.baumartbot != '')){
		// stadtbaum-baumstandort-20140508.show.json
		data.baumartbot = trimQuotes( data.baumartbot);
		data.baumartbot = data.baumartbot.replace( /\\'/g, "'");
		strInfo += 'Botanischer Name: ' + data.baumartbot + '<br>';
	}
	if(( typeof data.pflanzp !== 'undefined') && (data.pflanzp != '')){
		// stadtbaum-baumstandort-20140508.show.json
		if( 1 == data.pflanzp) {
			data.pflanzp = 'Herbst 2012';
		} else if( 4 == data.pflanzp) {
			data.pflanzp = 'Frühjahr 2014';
		}
		strInfo += 'Pflanzperiode: ' + data.pflanzp + '<br>';
	}
	if(( typeof data.material !== 'undefined') && (data.material != '')){
		// stadtbaum-baumstandort-20140508.show.json
		data.material = trimQuotes( data.material);
		if( '' == data.material) {
			data.material = 'nicht gepflanzt';
		}
		strInfo += 'Der Baum wurde ' + data.material + '<br>';
	}

	if( strH2 != '') {
		str += '<h2>' + strH2 + '</h2>';
	}
	if( strAddr != '') {
		str += '<div style="padding:0 0 .5em 0;">' + strAddr + '</div>';
	}
	if( arrayPhone.length > 0) {
		for( i = 0; i < arrayPhone.length; ++i) {
			var phoneVec = arrayPhone[i].split( ',');
			if( phoneVec.length < 2) {
				phoneVec = arrayPhone[i].split( 'oder');
			}
			for( j = 0; j < phoneVec.length; ++j) {
				var isFax = false;
				phoneVec[j] = phoneVec[j].trim();
				if( 'Telefon: ' == phoneVec[j].substring( 0, 9)) {
					phoneVec[j] = phoneVec[j].substring( 9);
				} else if( 'Mobil: ' == phoneVec[j].substring( 0, 7)) {
					phoneVec[j] = phoneVec[j].substring( 7);
				} else if( 'Fax: ' == phoneVec[j].substring( 0, 5)) {
					phoneVec[j] = phoneVec[j].substring( 5);
					isFax = true;
				} else if( 'Telefax: ' == phoneVec[j].substring( 0, 9)) {
					phoneVec[j] = phoneVec[j].substring( 9);
					isFax = true;
				}

				if( isFax) {
					str += '<div class="link"><div class="round round-fax"><i class="fa fa-fax"></i></div> ' + phoneVec[j] + '</div>';
				} else {
					str += '<div class="link"><div class="round round-phone"><i class="fa fa-phone"></i></div> ' + phoneVec[j] + '</div>';
				}
			}
		}
	}
	if( arrayNet.length > 0) {
		for( i = 0; i < arrayNet.length; ++i) {
			var netVec = arrayNet[i].split( ' ');
			for( j = 0; j < netVec.length; ++j) {
				var isMail = false;

				if( netVec[j].indexOf( '@') > 0) {
					isMail = true;
				} else if( netVec[j].indexOf( 'www.') == 0) {
					netVec[j] = 'http://' + netVec[j];
				} else if( netVec[j].indexOf( 'http') != 0) {
					continue;
				}

				if( isMail) {
					str += '<div class="link"><div class="round round-envelope"><i class="fa fa-envelope"></i></div> <a href="mailto:' + netVec[j] + '">' + netVec[j] + '</a></div>';
				} else {
					var strLink = netVec[j];
					if( 'http://' == strLink.substring( 0, 7)) {
						strLink = strLink.substring( 7);
					} else if( 'https://' == strLink.substring( 0, 8)) {
						strLink = strLink.substring( 8);
					}
					if( 'www.' == strLink.substring( 0, 4)) {
						strLink = strLink.substring( 4);
					}
					str += '<div class="link"><div class="round round-link"><i class="fa fa-link"></i></div> <a href="' + netVec[j] + '" target="_blank">' + strLink + '</a></div>';
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
	$( '#mapSelectItem').css( 'display', 'block');
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

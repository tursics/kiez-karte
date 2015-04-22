/*
*/

var map = null;
var showWelcome = false;

var dataAge = -1;
var dataGeoSet = new Array();
var idAddress = 1000;
var idHood = 1001;

// -----------------------------------------------------------------------------

function initMap( elementName, lat, lng, zoom)
{
	if( null == map) {
		var mapboxToken = 'pk.eyJ1IjoidHVyc2ljcyIsImEiOiI1UWlEY3RNIn0.U9sg8F_23xWXLn4QdfZeqg';
		var mapboxTiles = L.tileLayer( 'https://{s}.tiles.mapbox.com/v4/tursics.l7ad5ee8/{z}/{x}/{y}.png?access_token=' + mapboxToken, {
			attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a> | <a href="/imprint">Impressum</a> | <a href="/copyright">Copyright</a> | <a href="/imprint">Kontakt</a>'
		});

		map = L.map( elementName, {zoomControl: false})
			.addLayer( mapboxTiles)
			.setView( [lat, lng], zoom);

		map.addControl( L.control.zoom({ position: 'bottomright'}));
	}
}

// -----------------------------------------------------------------------------

$( document).on( "pagecreate", "#pageMap", function()
{
	// center the city hall
//	initMap( 'mapContainer', 52.515807, 13.479470, 16);

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
	$( '#displayAddress').on( 'click', function( e) {
		setAge( idAddress);
	});

	$( '#displayNormal').on( 'click', function( e) {
//		map.setBaseMapType( map.NORMAL, 'default');
	});
	$( '#displaySatelite').on( 'click', function( e) {
//		map.setBaseMapType( map.SATELLITE, 'default');
	});
	$( '#displayCar').on( 'click', function( e) {
//		map.setBaseMapType( map.TRAFFIC, 'default');
	});
	$( '#displayBus').on( 'click', function( e) {
//		map.setBaseMapType( map.SMART_PT, 'default');
	});

	initDragnDrop();

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

function createFTPLink( str)
{
	if(( str.indexOf( '[[') == 0) && (str.lastIndexOf( ']]') == (str.length - 2))) {
		str = str.substring( 2, str.length - 2);
	}
	if( str.lastIndexOf( '|') > 0) {
		title = str.substring( str.lastIndexOf( '|') + 1, str.length);
		str = str.substring( 0, str.lastIndexOf( '|'));
	} else {
		title = 'Bericht';
	}

	return '<a href="' + str + '" target="_blank">' + title + '</a>';
}

// -----------------------------------------------------------------------------

$( document).on( "pageshow", "#pageMap", function()
{
	// center the city hall
	initMap( 'mapContainer', 52.515807, 13.479470, 16);

	if( showWelcome) {
		showWelcome = false;
		$( '#welcomeClose').on( 'click', function( e) {
			$( '#popupWelcome').popup( 'close');
		});
		$( '#popupWelcome').popup( 'open');
	}

//	map.on( 'load', function() {
		handleURLQueries();
//	});
});

// -----------------------------------------------------------------------------

function handleURLQueries()
{
	var queries = location.search.replace(/^\?/, '').split('&');
	var params = {};
	for( var i = 0; i < queries.length; ++i) {
		split = queries[i].split( '=');
		params[split[0]] = split[1];
	}

	if( typeof params['layer'] !== 'undefined') {
		var layer = params['layer'].split( ',');
		for( var i = 0; i < layer.length; i += 2) {
			onShowData( layer[i], layer[i + 1]);
		}
	}

	map.on( 'zoomend', function() {
		saveURLQueries();
	});
	map.on( 'moveend', function() {
		saveURLQueries();
	});

	if( typeof params['zoom'] !== 'undefined') {
		map.setZoom( params['zoom']);
	}
	if(( typeof params['lat'] !== 'undefined') && (typeof params['lng'] !== 'undefined')) {
		map.setView( L.latLng( parseFloat( params['lat']), parseFloat( params['lng'])));
	}
}

// -----------------------------------------------------------------------------

function saveURLQueries()
{
	var url = '/?lat=' + parseInt( map.getCenter().lat * 10000) / 10000;
	url += '&lng=' + parseInt( map.getCenter().lng * 10000) / 10000;
	url += '&zoom=' + parseInt( map.getZoom() * 100) / 100;

	var layer = '';
	for( var i = 0; i < dataGeoSet.length; ++i) {
		if( layer.length > 0) {
			layer += ',';
		}
		layer += dataGeoSet[ i].id + ',' + dataGeoSet[ i].age;
	}
	if( layer.length > 0) {
		url += '&layer=' + layer;
	}

//	history.pushState( {}, '', url);
	history.replaceState( {}, '', url);
}

// -----------------------------------------------------------------------------

function updateMapSelectData()
{
	var str = '';

	if( dataGeoSet.length > 0) {
		str += '<ul data-role="listview" data-inset="false" data-split-icon="minus" data-split-theme="d" id="mapSelectDataList">';
		for( var i = 0; i < dataGeoSet.length; ++i) {
			var idx = dataGeoSet[ i].id;
			var ageStr = 'age' + dataGeoSet[ i].age;

			if( idx == idAddress) {
				str += '<li><a href="#" border=0><i class="fa fa-home"></i> Häuser</a>';
			} else if( idx == idHood) {
				str += '<li><a href="#" border=0><i class="fa fa-home"></i> Gebiete</a>';
			} else {
				str += '<li><a href="#" border=0><i class="fa ' + dataVec[idx].icon + '"></i> ' + dataVec[idx][ageStr] + '</a>';
			}
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
		// buergerservice-familie-sbst.show.json
		strH2 = data.einrichtung;
	} else if( typeof data.einrichtung_name !== 'undefined') {
		// heimaufsicht-pruefberichte.show.json
		strH2 = data.einrichtung_name;
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
	} else if( typeof data.NAME !== 'undefined') {
		// re-friedh.show.json
		strH2 = data.NAME;
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
	} else if( typeof data.Schulname !== 'undefined') {
		// schuldaten.show.json
		strH2 = trimQuotes( data.Schulname);
	}

	if( typeof data.strasse !== 'undefined') {
		data.strasse = trimQuotes( data.strasse);
		if( typeof data.hausnr !== 'undefined') {
			strAddr += data.strasse + ' ' + trimQuotes( data.hausnr) + '<br>';
		} else {
			strAddr += data.strasse + '<br>';
		}
	}
	if( typeof data.STRASSE !== 'undefined') {
		strAddr += data.STRASSE + '<br>';
	} else if( typeof data.Strasse !== 'undefined') {
		strAddr += data.Strasse + '<br>';
	}
	if(( typeof data.einrichtung_strasse !== 'undefined') && (typeof data.einrichtung_hnr !== 'undefined')) {
		strAddr += data.einrichtung_strasse + ' ' + data.einrichtung_hnr + '<br>';
	}
	if( typeof data.anschrift !== 'undefined') {
		strAddr += data.anschrift + '<br>';
	}
	if( typeof data.plz_ort !== 'undefined') {
		strAddr += data.plz_ort + '<br>';
	} else if( typeof data.plz !== 'undefined') {
		strAddr += trimQuotes( data.plz) + ' Berlin<br>';
	} else if( typeof data.PLZ !== 'undefined') {
		strAddr += data.PLZ + ' Berlin<br>';
	}
	if(( typeof data.einrichtung_plz !== 'undefined') && (typeof data.einrichtung_ort !== 'undefined')) {
		strAddr += data.einrichtung_plz + ' ' + data.einrichtung_ort + '<br>';
	}

	if(( typeof data.telefon !== 'undefined') && (data.telefon != '')) {
		arrayPhone.push( data.telefon);
	} else if(( typeof data.Telefon !== 'undefined') && (data.Telefon != '')) {
		arrayPhone.push( data.Telefon);
	}
	if(( typeof data.einrichtung_telefon !== 'undefined') && (data.einrichtung_telefon != '')) {
		arrayPhone.push( data.einrichtung_telefon);
	}
	if(( typeof data.einrichtung_fax !== 'undefined') && (data.einrichtung_fax != '')) {
		arrayPhone.push( 'Fax: ' + data.einrichtung_fax);
	} else if(( typeof data.Fax !== 'undefined') && (data.Fax != '')) {
		arrayPhone.push( 'Fax: ' + data.Fax);
	}

	if( typeof data.webadressen !== 'undefined') {
		arrayNet.push( data.webadressen);
	}
	if( typeof data.mail !== 'undefined') {
		arrayNet.push( data.mail);
	}
	if( typeof data.email !== 'undefined') {
		arrayNet.push( data.email);
	} else if( typeof data.eMail !== 'undefined') {
		arrayNet.push( data.eMail);
	}
	if( typeof data.einrichtung_email !== 'undefined') {
		arrayNet.push( data.einrichtung_email);
	}
	if( typeof data.e_mail !== 'undefined') {
		arrayNet.push( data.e_mail);
	}
	if( typeof data.e_mail2 !== 'undefined') {
		arrayNet.push( data.e_mail2);
	}
	if( typeof data.internet !== 'undefined') {
		arrayNet.push( data.internet);
	} else if( typeof data.Internet !== 'undefined') {
		arrayNet.push( data.Internet);
	}
	if( typeof data.www !== 'undefined') {
		arrayNet.push( data.www);
	}
	if( typeof data.w3 !== 'undefined') {
		arrayNet.push( data.w3);
	}

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
	if(( typeof data.termin !== 'undefined') && (data.termin != '')) {
		// buergerservice-familie-sbst.show.json
		strInfo += 'am ' + formatDate( data.termin) + '<br>';
	}
	if(( typeof data.tage !== 'undefined') && (data.tage != '')) {
		// maerkte-wochen-antik.show.json
		strInfo += 'am ' + data.tage + '<br>';
	}
	if(( typeof data.uhrzeit !== 'undefined') && (data.uhrzeit != '')){
		// buergerservice-familie-sbst.show.json
		strInfo += 'um ' + data.uhrzeit + '<br>';
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
	if(( typeof data.veranstaltung !== 'undefined') && (data.veranstaltung != '')) {
		// buergerservice-familie-sbst.show.json
		strInfo += data.veranstaltung + '<br>';
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
	if(( typeof data['FLÄCHE'] !== 'undefined') && (data['FLÄCHE'] != '')){
		// re-friedh.show.json
		strInfo += 'Fläche: ' + data['FLÄCHE'] + 'm²<br>';
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
	if(( typeof data.material !== 'undefined') && (typeof data.spendenstatus !== 'undefined')){
		// stadtbaum-baumstandort-20140508.show.json
		data.material = trimQuotes( data.material);
		data.spendenstatus = trimQuotes( data.spendenstatus);
		if( 'GEPFLANZT' == data.material) {
			strInfo += 'Dieser Baum wurde gepflanzt<br>';
		} else if( 'GESPENDET' == data.spendenstatus) {
			strInfo += 'Dieser Baum konnte gepflanzt werden, dank einer Spende!<br>';
		} else {
			strInfo += 'Leider konnte dieser Baum nicht gepflanzt werden.<br>';
		}
	}
	if(( typeof data.einrichtung_platzzahl !== 'undefined') && (data.einrichtung_platzzahl != '')){
		// heimaufsicht-pruefberichte.show.json
		strInfo += 'Plätze: ' + data.einrichtung_platzzahl + '<br>';
	}
	if(( typeof data.einrichtung_versorgungsform !== 'undefined') && (data.einrichtung_versorgungsform != '')){
		// heimaufsicht-pruefberichte.show.json
		strInfo += 'Versorgungsform: ' + data.einrichtung_versorgungsform + '<br>';
	}
	if(( typeof data.einrichtung_wohnform !== 'undefined') && (data.einrichtung_wohnform != '')){
		// heimaufsicht-pruefberichte.show.json
		strInfo += 'Wohnform: ' + data.einrichtung_wohnform + '<br>';
	}
	if(( typeof data.traeger_name !== 'undefined') && (data.traeger_name != '')){
		// heimaufsicht-pruefberichte.show.json
		strInfo += 'Träger: ' + data.traeger_name + '<br>';
	}
	for( var i = 1; i <= 10; ++i) {
		// heimaufsicht-pruefberichte.show.json
		var baseName = 'pruefung_' + i;
		if(( typeof data[ baseName] === 'undefined') || (data[ baseName] == '')){
			break;
		}
		if(( typeof data[ baseName] !== 'undefined') && (data[ baseName] != '')){
			strInfo += '• ' + createFTPLink( data[ baseName]) + '<br>';
		}
		if(( typeof data[ baseName + '_gegendarstellung_1'] !== 'undefined') && (data[ baseName + '_gegendarstellung_1'] != '')){
			strInfo += '• ' + createFTPLink( data[ baseName + '_gegendarstellung_1']) + '<br>';
		}
		if(( typeof data[ baseName + '_ergaenzender_bericht_1'] !== 'undefined') && (data[ baseName + '_ergaenzender_bericht_1'] != '')){
			strInfo += '• ' + createFTPLink( data[ baseName + '_ergaenzender_bericht_1']) + '<br>';
		}
		if(( typeof data[ baseName + '_gegendarstellung_2'] !== 'undefined') && (data[ baseName + '_gegendarstellung_2'] != '')){
			strInfo += '• ' + createFTPLink( data[ baseName + '_gegendarstellung_2']) + '<br>';
		}
		if(( typeof data[ baseName + '_ergaenzender_bericht_2'] !== 'undefined') && (data[ baseName + '_ergaenzender_bericht_2'] != '')){
			strInfo += '• ' + createFTPLink( data[ baseName + '_ergaenzender_bericht_2']) + '<br>';
		}
		if(( typeof data[ baseName + '_gegendarstellung_3'] !== 'undefined') && (data[ baseName + '_gegendarstellung_3'] != '')){
			strInfo += '• ' + createFTPLink( data[ baseName + '_gegendarstellung_3']) + '<br>';
		}
	}
	if(( typeof data.KONFESS !== 'undefined') && (data.KONFESS != '')){
		// re-friedh.show.json
		if( 'rk' == data.KONFESS) {
			data.KONFESS = 'katholisch';
		} else if( 'ev' == data.KONFESS) {
			data.KONFESS = 'evangelisch';
		} else if( 'ld' == data.KONFESS) {
			data.KONFESS = 'landeseigen';
		}
		strInfo += 'Konfession: ' + data.KONFESS + '<br>';
	}
	if(( typeof data.EHRENGRAB !== 'undefined') && (data.EHRENGRAB != '')){
		// re-friedh.show.json
		strInfo += 'Ehrengrabstätten: ' + data.EHRENGRAB + '<br>';
	}
	if(( typeof data.Schulart !== 'undefined') && (data.Schulart != '')){
		// schuldaten.show.json
		if(( typeof data.Schulzweig !== 'undefined') && (data.Schulzweig != data.Schulart)){
			strInfo += data.Schulart + ' (' + data.Schulzweig + ')<br>';
		} else {
			strInfo += data.Schulart + '<br>';
		}
	}
	if(( typeof data.Schulleitung !== 'undefined') && (data.Schulleitung != '')){
		// schuldaten.show.json
		strInfo += 'Schulleitung: ' + data.Schulleitung + '<br>';
	}
	if(( typeof data.BemerkungenSchulzweig !== 'undefined') && (data.BemerkungenSchulzweig != '')){
		// schuldaten.show.json
		strInfo += data.BemerkungenSchulzweig + '<br>';
	}
	if(( typeof data.spez_Angebote !== 'undefined') && (data.spez_Angebote != '')){
		// schuldaten.show.json
		strInfo += data.spez_Angebote + '<br>';
	}
	if(( typeof data.Schultraeger !== 'undefined') && (data.Schultraeger != '')){
		// schuldaten.show.json
		strInfo += data.Schultraeger + 'er Träger<br>';
	}
	if(( typeof data.Bauten !== 'undefined') && (data.Bauten != '')){
		// schuldaten.show.json
		strInfo += data.Bauten + '<br>';
	}
	if(( typeof data.houseid !== 'undefined') && (data.houseid != '')){
		var path = 'http://img.kiez-karte.berlin/';
		for( var i = 0; i < data.houseid.length; i += 2) {
			path += data.houseid.substr( i, 2) + '/';

		}
		str += '<img src="' + path + 'img.jpg" style="width:19.9em;height:12em;margin:-.5em -.7em 0 -.7em;">';
	}
	if(( typeof data.objId !== 'undefined') && (data.objId != '')){
		var path = 'http://img.kiez-karte.berlin/';
		for( var i = 0; i < data.objId.length; i += 2) {
			path += data.objId.substr( i, 2) + '/';

		}
		strInfo += '<img src="' + path + 'img.jpg" style="width:19.9em;height:12em;margin:-1em -.7em -1em -0.7em;">';
		strInfo += '<a href="' + path + 'img.jpg">' + path.substr( 29) + '</a>';
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
		if( dataAge == idAddress) {
			str += '<i class="fa fa-home" style="padding-right:0.7em;"></i>Adressen und Gebiete<br>';
		} else if( dataAge < 6) {
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

		if( dataAge == idAddress) {
			str += '<li><a href="#" onClick="onShowHood();" border=0><i class="fa fa-home"></i> Gebiete</a></li>';
			str += '<li><a href="#" onClick="onShowAddress();" border=0><i class="fa fa-home"></i> Häuser</a></li>';
		} else {
			var ageStr = 'age' + dataAge;
			for( var i = 0; i < dataVec.length; ++i) {
				if( dataVec[i][ageStr].length > 0) {
					str += '<li><a href="#" onClick="onShowData(' + i + ',' + dataAge + ');" border=0><i class="fa ' + dataVec[i].icon + '"></i> ' + dataVec[i][ageStr] + '</a></li>';
				}
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
		var colorOut = {color: '#155764'};
		var colorOver = {color: '#8C9C88'};

		setAge( -1);

		for( var i = 0; i < dataGeoSet.length; ++i) {
			if( dataId == dataGeoSet[ i].id) {
				dataGeoSet[ i].age = ageId;
				dataGeoSet.push( dataGeoSet[ i]);
				dataGeoSet.splice( i, 1);

				updateMapSelectData();
				saveURLQueries();
				return;
			}
		}

		dataGeoSet.push({
			id: dataId,
			age: ageId,
			layerGroup: L.featureGroup([])
		});

		var layerGroup = dataGeoSet[ dataGeoSet.length - 1].layerGroup;

		layerGroup.addEventListener( 'click', function( evt) {
			updateMapSelectItem( evt.layer.options.data);
		});
//		layerGroup.addEventListener( 'mouseover', function( evt) {
//			evt.target.set( 'brush', colorOver);
//			map.update( -1, 0);
//		});
//		layerGroup.addEventListener( 'mouseout', function( evt) {
//			evt.target.set( 'brush', colorOut);
//			map.update( -1, 0);
//		});
		layerGroup.addTo(map);

		updateMapSelectData();
		saveURLQueries();

		var dataUrl = dataVec[ dataId].url;
		if( 0 != dataUrl.indexOf( 'http://')) {
			dataUrl = 'data/' + dataUrl;
		}
		$.getJSON( dataUrl, function( data) {
			try {
				$.each( data, function( key, val) {
					if((typeof val.lat != 'undefined') && (typeof val.lng != 'undefined')) {
						var marker = L.marker([parseFloat( val.lat), parseFloat( val.lng)],{
//							brush: colorOut,
							data: val
						});
						layerGroup.addLayer( marker);
					}
				});

				if( layerGroup.getLayers().length > 0) {
					map.fitBounds( layerGroup.getBounds());
				}
			} catch( e) {
//				alert( e);
			}
		});
	}
}

// -----------------------------------------------------------------------------

function onShowHood()
{
	var fillStyle = {color:'#f00',weight:1,fillOpacity:0.05};
	var dataAge = idAddress;
	var dataId = idHood;

	setAge( -1);

	for( var i = 0; i < dataGeoSet.length; ++i) {
		if( dataId == dataGeoSet[ i].id) {
			dataGeoSet[ i].age = dataAge;
			dataGeoSet.push( dataGeoSet[ i]);
			dataGeoSet.splice( i, 1);

			updateMapSelectData();
			saveURLQueries();
			return;
		}
	}

	dataGeoSet.push({
		id: dataId,
		age: dataAge,
		layerGroup: L.featureGroup([])
	});

	var layerGroup = dataGeoSet[ dataGeoSet.length - 1].layerGroup;

	layerGroup.addEventListener( 'click', function( evt) {
		updateMapSelectItem( evt.layer.options.data);
	});
//	layerGroup.addEventListener( 'mouseover', function( evt) {
//		evt.target.set( 'brush', colorOver);
//		map.update( -1, 0);
//	});
//	layerGroup.addEventListener( 'mouseout', function( evt) {
//		evt.target.set( 'brush', colorOut);
//		map.update( -1, 0);
//	});
	layerGroup.addTo(map);

	updateMapSelectData();
	saveURLQueries();

//				$.each( data, function( key, val) {
//					if((typeof val.lat != 'undefined') && (typeof val.lng != 'undefined')) {
//						var marker = L.marker([parseFloat( val.lat), parseFloat( val.lng)],{
//							brush: colorOut,
//							data: val
//						});
//						layerGroup.addLayer( marker);
//					}
//				});

	var dataUrl = 'data/RBS_OD_LOR_1412.json';
	$.getJSON( dataUrl, function( data) {
		try {
			$.each( data, function( key, val) {
				var shape = L.geoJson( val.shape, {
					style: function (feature) {
						return fillStyle;
					},
					data: val
				});
				layerGroup.addLayer( shape);
			});

			if( layerGroup.getLayers().length > 0) {
				map.fitBounds( layerGroup.getBounds());
			}
		} catch( e) {
//			alert( e);
		}
	});
}

// -----------------------------------------------------------------------------

function onShowAddress()
{
	var fillStyle = {color:'#f00',weight:0,fillOpacity:0.05};
	var greenStyle = {color:'#0f0',weight:0,fillOpacity:0.5};
	var redStyle = {color:'#f00',weight:0,fillOpacity:0.5};
	var dataAge = idAddress;
	var dataId = idAddress;

	setAge( -1);

	for( var i = 0; i < dataGeoSet.length; ++i) {
		if( dataId == dataGeoSet[ i].id) {
			dataGeoSet[ i].age = dataAge;
			dataGeoSet.push( dataGeoSet[ i]);
			dataGeoSet.splice( i, 1);

			updateMapSelectData();
			saveURLQueries();
			return;
		}
	}

	dataGeoSet.push({
		id: dataId,
		age: dataAge,
		layerGroup: L.featureGroup([])
	});

	var layerGroup = dataGeoSet[ dataGeoSet.length - 1].layerGroup;

	layerGroup.addEventListener( 'click', function( evt) {
		updateMapSelectItem( evt.layer.options.data);
	});
	layerGroup.addTo(map);

	updateMapSelectData();
	saveURLQueries();

	var dataUrl = 'data/HKO_Lichtenberg_Geographisch_140416.txt';
	$.get( dataUrl, function( data) {
		try {
			var lines = data.split( "\n");

			$.each( lines, function( key, val) {
				if( val.length > 0) {
					var arr = val.split( ';');

					var obj = {
						objId: arr[1],
						hoodKey: arr[7],
						streetKey: arr[8],
						strasse: arr[13],
						hausnr: arr[9] + arr[10],
						plz: arr[14],
						ort: arr[15],
						lat: arr[12].replace( ',', '.'),
						lng: arr[11].replace( ',', '.'),

					};

					if( obj.hoodKey == '1103') {
						var shape = L.circle([ obj.lat, obj.lng], 4, {
							style: fillStyle,
							data: obj
						});
						layerGroup.addLayer( shape);
					}
				}
			});

//			if( layerGroup.getLayers().length > 0) {
//				map.fitBounds( layerGroup.getBounds());
//			}

			var imageUrl = 'scripts/imgexists.php?id=';
			var layerId = 0;
			var layers = layerGroup.getLayers();
			var countRed = 0;
			var countGreen = 0;

			function checkImg()
			{
				$.get( imageUrl + layers[ layerId].options.data.objId, function( data) {
					try {
						layers[ layerId].setStyle( '1' == data ? greenStyle : redStyle);

						if( '1' == data) {
							++countGreen;
						} else {
							++countRed;
						}
					} catch( e) {
//						alert( e);
					}
					++layerId;
					if( layerId < layerGroup.getLayers().length) {
						checkImg();

					} else {
						console.log( 'Good images: '+countGreen);

						console.log( 'Missing images: '+countRed);
					}
				});
			}
			checkImg();
		} catch( e) {
			console.log( e);
		}
	});
}

// -----------------------------------------------------------------------------

function onRemoveData( dataId)
{
	if( dataId < dataGeoSet.length) {
		map.removeLayer( dataGeoSet[ dataId].layerGroup);
		dataGeoSet.splice( dataId, 1);
	}

	setAge( -1);
	updateMapSelectData();
	saveURLQueries();
}

// -----------------------------------------------------------------------------

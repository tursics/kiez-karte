/*
*/

var map = null;
var showWelcome = false;

var dataAge = -1;
var dataGeoSet = new Array();

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

		var dataUrl = 'data/gebaeudescan.json';
		$.getJSON( dataUrl, function( data) {
			createMarker( data);
		});
	}
}

// -----------------------------------------------------------------------------

function createMarker( data)
{
	try {
		var markerSchool = L.AwesomeMarkers.icon({
//			icon: 'fa-child',
//			icon: 'fa-graduation-cap',
			icon: 'fa-user',
//			icon: 'fa-users',
			prefix: 'fa',
			markerColor: 'blue'
		});

		var markerExtension = L.AwesomeMarkers.icon({
//			icon: 'fa-plus',
			icon: 'fa-user-plus',
			prefix: 'fa',
			markerColor: 'blue'
		});

		var markerSport = L.AwesomeMarkers.icon({
			icon: 'fa-soccer-ball-o',
			prefix: 'fa',
			markerColor: 'orange'
		});

		var markerTraffic = L.AwesomeMarkers.icon({
			icon: 'fa-car',
			prefix: 'fa',
			markerColor: 'purple'
		});

		var markerMulti = L.AwesomeMarkers.icon({
			icon: 'fa-building-o',
			prefix: 'fa',
			markerColor: 'purple'
		});

		var markerOthers = L.AwesomeMarkers.icon({
			icon: 'fa-building-o',
			prefix: 'fa',
			markerColor: 'red'
		});

		var layerGroup = L.featureGroup([]);
		layerGroup.addTo(map);

		layerGroup.addEventListener( 'click', function( evt) {
			updateMapSelectItem( evt.layer.options.data);
		});

		$.each( data, function( key, val) {
			if((typeof val.lat != 'undefined') && (typeof val.lng != 'undefined')) {
				var isSchool  = val.Bauwerk.startsWith( 'Schul') || val.Bauwerk.startsWith( 'Hauptgebäude') || val.Bauwerk.startsWith( 'Altbau');
				var isSport   = val.Bauwerk.startsWith( 'Sport');
				var isExt     = val.Bauwerk.startsWith( 'MUR') || val.Bauwerk.startsWith( 'MEB');
				var isMulti   = val.Bauwerk.startsWith( 'MZG');
				var isTraffic = val.Schulname.indexOf( 'verkehrsschule') !== -1;
				var marker = L.marker([parseFloat( val.lat), parseFloat( val.lng)],{
					data: fixData(val),
					icon: isTraffic ? markerTraffic :
						isSchool ? markerSchool :
						isSport ? markerSport :
						isExt ? markerExtension :
						isMulti ? markerMulti :
						markerOthers
				});
				layerGroup.addLayer( marker);
			}
		});
	} catch( e) {
		console.log(e);
	}
}

// -----------------------------------------------------------------------------

function fixData(val)
{
	function fixComma( item) {
		if( item === '') {
			return 0;
		} else if( item === null) {
			return 0;
		}
		return parseFloat( String( item).replace('.', '').replace(',', '.'));
	}

	function fixEuro( item) {
		if( item === '') {
			return 0;
		} else if( item === null) {
			return 0;
		} else if( 'T€' === item.substring( item.length - 2)) {
			return parseInt( item.substring( 0, item.length - 2).replace('.', '').replace(',', '.')) * 1000;
		}
		return item;
	}

	val.NGF = fixComma( val.NGF);
	val.BGF = fixComma( val.BGF);
	val.GebaeudeHoeheInM = fixComma( val.GebaeudeHoeheInM);
	val.GebaeudeUmfangInMAusConject = fixComma( val.GebaeudeUmfangInMAusConject);
	val.FassadenFlaeche = fixComma( val.FassadenFlaeche);
	val.Dachflaeche = fixComma( val.Dachflaeche);
	val.BWCAnzahl = fixComma( val.BWCAnzahl);
	val.RaeumeNutzflaecheBGF = fixComma( val.RaeumeNutzflaecheBGF);
	val.bereitsSanierteFlaecheInProzent = fixComma( val.bereitsSanierteFlaecheInProzent);

	val.FensterKosten = fixEuro( val.FensterKosten);
	val.FassadenKosten = fixEuro( val.FassadenKosten);
	val.DachKosten = fixEuro( val.DachKosten);
	val.AufzugKosten = fixEuro( val.AufzugKosten);
	val.RampeKosten = fixEuro( val.RampeKosten);
	val.EingangKosten = fixEuro( val.EingangKosten);
	val.TuerenKosten = fixEuro( val.TuerenKosten);
	val.BWCKosten = fixEuro( val.BWCKosten);
	val.ZwischensummeBarrierefreiheitKosten = fixEuro( val.ZwischensummeBarrierefreiheitKosten);
	val.zweiterRettungswegKosten = fixEuro( val.zweiterRettungswegKosten);
	val.RaeumeKosten = fixEuro( val.RaeumeKosten);
	val.Raeume2Kosten = fixEuro( val.Raeume2Kosten);
	val.SanitaerKosten = fixEuro( val.SanitaerKosten);
	val.GebaeudeGesamt = fixEuro( val.GebaeudeGesamt);

	if( val.SanitaerSanierungsjahr === 0) {
		val.SanitaerSanierungsjahr = '-';
	} else if( val.SanitaerSanierungsjahr === null) {
		val.SanitaerSanierungsjahr = '-';
	}

	return val;
}

// -----------------------------------------------------------------------------

$( document).on( "pagecreate", "#pageMap", function()
{
	// center the city hall
//	initMap( 'mapContainer', 52.515807, 13.479470, 16);

	updateMapSelectData();

//	showWelcome = true;
});

// -----------------------------------------------------------------------------

$( document).on( "pageshow", "#pageMap", function()
{
	// center the city hall
	initMap( 'mapContainer', 52.515807, 13.479470, 16);

	$( '#receipt .group').on( 'click', function( e) {
		$(this).toggleClass('groupClosed');
	});

	if( showWelcome) {
		showWelcome = false;
		$( '#welcomeClose').on( 'click', function( e) {
			$( '#popupWelcome').popup( 'close');
		});
		$( '#popupWelcome').popup( 'open');
	}
});

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

//	$( '#mapSelectData').html( str);
	$( '#mapSelectDataList').listview();
}

// -----------------------------------------------------------------------------

function updateMapSelectItem( data)
{
	function setText( key, txt) {
		var item = $( '#rec' + key);

		if( item.parent().hasClass( 'number')) {
			txt = '' + parseInt( txt);
			var pos = txt.length;
			while( pos > 3) {
				pos -= 3;
				txt = txt.slice(0, pos) + '.' + txt.slice(pos);
			}
		} else if( item.parent().hasClass( 'boolean')) {
			txt = (txt === 1 ? 'ja' : 'nein');
		}

		item.text( txt);
	}

	for(var key in data) {
		setText( key, data[key]);
	}

	setText( 'FensterKosten_', data.FensterFaktorFlaechenanteil * data.FensterFlaeche * data.FensterKostenpauschale);

	var date = new Date(),
		dateD = date.getDate(),
		dateM = date.getMonth() + 1,
		dateY = date.getFullYear(),
		dateH = date.getHours(),
		dateMin = date.getMinutes(),
		dateSec = date.getSeconds();
	if(dateD < 10) {
		dateD = '0' + dateD;
	}
	if(dateM < 10) {
		dateM = '0' + dateM;
	}
	if(dateH < 10) {
		dateH = '0' + dateH;
	}
	if(dateMin < 10) {
		dateMin = '0' + dateMin;
	}
	if(dateSec < 10) {
		dateSec = '0' + dateSec;
	}
	setText( 'Now_', dateD + '.' + dateM + '.' + dateY + ' ' + dateH + ':' + dateMin + ':' + dateSec);

	$( '#receipt').css( 'display', 'block');

	// unused rows
	//   Gebaeudenummer
	//   ZeileVerknuepfung
	//   Kapitel
	//   loeschen
	//   ausblendenBungalowSchuppen
	//   Foo1
	//   BezirkGesamtinMio
	//   Foo3
	//   Foo4
	//   Foo5
	//   Foo6
	//   Foo7

	var str = '';
	var strArea = '';

	str += 'Klick mal auf die Zeilen...';

	strArea = 'Priorität Gesamt: ' + data.PrioritaetGesamt + '<br>';
	strArea += 'BauPrio Bauwerk: ' + data.BauPrioBauwerk + '<br>';
	strArea += 'BauPrio Gebäudetechnik: ' + data.BauPrioTGA + '<br>';
//	strArea += 'BauPrio Außen: ' + data.BauPrioAussen + '<br>';
	strArea += 'Bauprio Summe (ohne Wichtung): ' + data.BauprioSumme + '<br>';
//	strArea += 'SchulPrio Fachraum: ' + data.SchulPrioFachraum + '<br>';
//	strArea += 'SchulPrio Sanitär: ' + data.SchulPrioSanitaer + '<br>';
//	strArea += 'SchulPrio Ganztag Essen: ' + data.SchulPrioGanztagEssen + '<br>';
//	strArea += 'SchulPrio Summe (ohne Wichtung): ' + data.SchulPrioSumme + '<br>';
//	strArea += 'Priorität Wertung: ' + data.PrioritaetWertung + '<br>';

	str += '<div class="info receiptPart receiptPartClosed">' + strArea + '</div>';

	strArea = 'Fassaden Kosten: ' + data.FassadenKosten + ' €<br>';
	strArea += 'Sanierung notwendig: ' + (data.SanierungFassadenNotwendig === 1 ? 'ja' : 'nein') + '<br>';
	strArea += 'Gebäude Höhe: ' + data.GebaeudeHoeheInM + ' m<br>';
	strArea += 'Gebäude Umfang: ' + data.GebaeudeUmfangInMAusConject + ' m<br>';
	strArea += 'Fassaden Fläche: ' + data.FassadenFlaeche + ' m²<br>';
	strArea += 'Fassaden Fläche ohne Fenster: ' + data.FassadenFlaecheOhneFenster + ' m²<br>';
	strArea += 'Faktor Flächenanteil: ' + data.FassadenFaktorFlaechenanteil + '<br>';
	strArea += 'Kostenpauschale: ' + data.FassadenKostenpauschale + ' €/m²<br>';

	str += '<div class="info receiptPart receiptPartClosed">' + strArea + '</div>';

	strArea = 'Dach Kosten: ' + data.DachKosten + ' €<br>';
	strArea += 'Sanierung notwendig: ' + (data.SanierungDachNotwendig === 1 ? 'ja' : 'nein') + '<br>';
	strArea += 'Dachart: ' + data.Dachart + '<br>';
	strArea += 'Dachfläche: ' + data.Dachflaeche + ' m²<br>';
	strArea += 'Kostenpauschale: ' + data.DachKostenpauschale + ' €/m²<br>';

	str += '<div class="info receiptPart receiptPartClosed">' + strArea + '</div>';

	strArea = 'Barrierefreiheit Kosten: ' + data.ZwischensummeBarrierefreiheitKosten + ' €<br>';
	strArea += 'Aufzug Kosten: ' + data.AufzugKosten + ' €<br>';
	strArea += 'Rampe Anzahl: ' + data.RampeAnzahl + '<br>';
	strArea += 'Rampe Kosten: ' + data.RampeKosten + ' €<br>';
	strArea += 'Eingang Anzahl: ' + data.EingangAnzahl + '<br>';
	strArea += 'Eingang Kosten: ' + data.EingangKosten + ' €<br>';
	strArea += 'Sanierung Türbreiten notwendig: ' + (data.SanierungTuerbreitenNotwendig === 1 ? 'ja' : 'nein') + '<br>';
	strArea += 'Türen Kosten: ' + data.TuerenKosten + ' €<br>';
	strArea += 'Barrierefreie WC Anzahl: ' + data.BWCAnzahl + '<br>';
	strArea += 'Barrierefreie WC Kosten: ' + data.BWCKosten + ' €<br>';

	str += '<div class="info receiptPart receiptPartClosed">' + strArea + '</div>';

	strArea = 'Zweiter Rettungsweg Kosten: ' + data.zweiterRettungswegKosten + ' €<br>';

	str += '<div class="info">' + strArea + '</div>';

	strArea = 'Räume Kosten: ' + data.RaeumeKosten + ' €<br>';
	strArea += 'Sanierung notwendig: ' + (data.SanierungRaeumeNotwendig === 1 ? 'ja' : 'nein') + '<br>';
	strArea += 'Räume Nutzfläche: ' + data.RaeumeNutzflaecheBGF + ' m²<br>';
	strArea += 'Räume Kostenpauschale: ' + data.RaeumeKostenpauschale + ' €/m²<br>';

	str += '<div class="info receiptPart receiptPartClosed">' + strArea + '</div>';

	strArea = 'Sanitär Kosten: ' + data.SanitaerKosten + ' €<br>';
	strArea += 'Sanitärfläche: ' + data.Sanitaerflaeche + ' m²<br>';
	strArea += 'Sanitär Sanierungsjahr: ' + data.SanitaerSanierungsjahr + '<br>';
	strArea += 'Bereits sanierte Fläche: ' + data.bereitsSanierteFlaecheInProzent + ' %<br>';
	strArea += 'Fläche nicht saniert: ' + data.FlaecheNichtSaniert + ' m²<br>';

	str += '<div class="info receiptPart receiptPartClosed">' + strArea + '</div>';

	strArea = 'Räume Kosten: ' + data.Raeume2Kosten + ' €<br>';
	strArea += 'Sanierung notwendig: ' + (data.SanierungRaeume2Notwendig === 1 ? 'ja' : 'nein') + '<br>';
	strArea += 'Räume Nutzfläche: ' + data.Raeume2Nutzflaeche + ' m²<br>';
	strArea += 'Räume Kostenpauschale: ' + data.Raeume2Kostenpauschale + ' €/m²<br>';

	str += '<div class="info receiptPart receiptPartClosed">' + strArea + '</div>';

	$( '#mapSelectItem').html( str);
	$( '#mapSelectItem').css( 'display', 'block');

	$( '.receiptPart').on( 'click', function( e) {
		$(this).toggleClass('receiptPartClosed');
	});
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

//	$( '#mapSelectInfo').html( str);
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

function onRemoveData( dataId)
{
	if( dataId < dataGeoSet.length) {
		map.removeLayer( dataGeoSet[ dataId].layerGroup);
		dataGeoSet.splice( dataId, 1);
	}

	setAge( -1);
	updateMapSelectData();
}

// -----------------------------------------------------------------------------

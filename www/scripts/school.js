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
		var iconMarker = L.AwesomeMarkers.icon({
			icon: 'fa-building-o',
			prefix: 'fa',
			markerColor: 'cadetblue'
		});

		var layerGroup = L.featureGroup([]);
		layerGroup.addTo(map);

		layerGroup.addEventListener( 'click', function( evt) {
			updateMapSelectItem( evt.layer.options.data);
		});

		$.each( data, function( key, val) {
			if((typeof val.lat != 'undefined') && (typeof val.lng != 'undefined')) {
				var marker = L.marker([parseFloat( val.lat), parseFloat( val.lng)],{
					data: fixData(val),
					icon: iconMarker
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
	val.SanitaerKosten = fixEuro( val.SanitaerKosten);
	val.Foo2 = fixEuro( val.Foo2);

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
	// unused rows
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

	strArea = data.Schulname;

	str += '<h2>' + strArea + '</h2>';

	strArea = '- ' + data.Bauwerk + ' -<br>';
//	strArea += data.Gebaeudenummer + '<br>';
	strArea += data.Schulart + ' (' + data.Schulnummer + ')<br>';
	strArea += data.Strasse + '<br>';
	strArea += data.PLZ + ' Berlin<br>';

	str += '<div style="padding:0 0 .5em 0;">' + strArea + '</div>';

	strArea = 'Nutzungsfläche: ' + data.NF + ' m²<br>';
	strArea += 'Geschossfläche: ' + data.GF + ' m²<br>';
	strArea += 'Netto-Raumfläche: ' + data.NGF + ' m²<br>';
	strArea += 'Brutto-Grundfläche: ' + data.BGF + ' m²<br>'; // == data.RaeumeNutzflaecheBGF
	strArea += 'Grundstücksfläche: ' + data.Grundstuecksflaeche + ' m²<br>';

	str += '<div class="info">' + strArea + '</div>';

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

	strArea = 'Fenster Kosten: ' + data.FensterKosten + ' €<br>';
	strArea += '<s>Sanierung notwendig: ' + (data.SanierungNotwendig === 1 ? 'ja' : 'nein') + '</s><br>';
	strArea += 'Fenster Fläche: ' + data.FensterFlaeche + ' m²<br>';
	strArea += '<s>Faktor Flächenanteil: ' + data.FaktorFlaechenanteil + '</s><br>';
	strArea += '<s>Kostenpauschale: ' + data.Kostenpauschale + ' €/m²</s><br>';

	str += '<div class="info receiptPart receiptPartClosed">' + strArea + '</div>';

	strArea = 'Fassaden Kosten: ' + data.FassadenKosten + ' €<br>';
	strArea += '<s>Sanierung notwendig: ' + (data.SanierungNotwendig === 1 ? 'ja' : 'nein') + '</s><br>';
	strArea += 'Gebäude Höhe: ' + data.GebaeudeHoeheInM + ' m<br>';
	strArea += 'Gebäude Umfang: ' + data.GebaeudeUmfangInMAusConject + ' m<br>';
	strArea += 'Fassaden Fläche: ' + data.FassadenFlaeche + ' m²<br>';
	strArea += 'Fassaden Fläche ohne Fenster: ' + data.FassadenFlaecheOhneFenster + ' m²<br>';
	strArea += '<s>Faktor Flächenanteil: ' + data.FaktorFlaechenanteil + '</s><br>';
	strArea += '<s>Kostenpauschale: ' + data.Kostenpauschale + ' €/m²</s><br>';

	str += '<div class="info receiptPart receiptPartClosed">' + strArea + '</div>';

	strArea = 'Dach Kosten: ' + data.DachKosten + ' €<br>';
	strArea += 'Sanierung notwendig: ' + (data.SanierungDachNotwendig === 1 ? 'ja' : 'nein') + '<br>';
	strArea += 'Dachart: ' + data.Dachart + '<br>';
	strArea += 'Dachfläche: ' + data.Dachflaeche + ' m²<br>';
	strArea += 'Kostenpauschale: ' + data['€'].Einheit + '  €/m²<br>';

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

	strArea = '<s>Räume Kosten: ' + data.RaeumeKosten + ' €</s><br>';
	strArea += '<s>Sanierung notwendig: ' + (data['SanierungNotw.'] === 1 ? 'ja' : 'nein') + '</s><br>';
	strArea += 'Räume Nutzfläche: ' + data.RaeumeNutzflaecheBGF + ' m²<br>';
	strArea += '<s>Räume Kostenpauschale: ' + data.RaeumeKostenpauschale + ' €/m²</s><br>';

	str += '<div class="info receiptPart receiptPartClosed">' + strArea + '</div>';

	strArea = 'Sanitär Kosten: ' + data.SanitaerKosten + ' €<br>';
	strArea += 'Sanitärfläche: ' + data.Sanitaerflaeche + ' m²<br>';
	strArea += 'Sanitär Sanierungsjahr: ' + data.SanitaerSanierungsjahr + '<br>';
	strArea += 'Bereits sanierte Fläche: ' + data.bereitsSanierteFlaecheInProzent + ' %<br>';
	strArea += 'Fläche nicht saniert: ' + data.FlaecheNichtSaniert + ' m²<br>';

	str += '<div class="info receiptPart receiptPartClosed">' + strArea + '</div>';

	strArea = '<s>Räume Kosten: ' + data.RaeumeKosten + ' €</s><br>';
	strArea += '<s>Sanierung notwendig: ' + (data['SanierungNotw.'] === 1 ? 'ja' : 'nein') + '</s><br>';
	strArea += 'Räume Nutzfläche: ' + data.RaeumeNutzflaeche + ' m²<br>';
	strArea += '<s>Räume Kostenpauschale: ' + data.RaeumeKostenpauschale + ' €/m²</s><br>';

	str += '<div class="info receiptPart receiptPartClosed">' + strArea + '</div>';

	strArea = 'Gesamt: ' + data.Foo2 + ' €<br>';

	str += '<div class="info">' + strArea + '</div>';

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

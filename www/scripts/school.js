/*
*/

var map = null;
var layerPopup = null;
var layerGroup = null;
var budget = null;

// -----------------------------------------------------------------------------

function mapAction()
{
	$('#headerBox').removeClass( 'big');
	$('#searchBox').removeClass( 'big');
}

// -----------------------------------------------------------------------------

function initMap( elementName, lat, lng, zoom)
{
	if( null == map) {
		var mapboxToken = 'pk.eyJ1IjoidHVyc2ljcyIsImEiOiI1UWlEY3RNIn0.U9sg8F_23xWXLn4QdfZeqg';
		var mapboxTiles = L.tileLayer( 'https://{s}.tiles.mapbox.com/v4/tursics.l7ad5ee8/{z}/{x}/{y}.png?access_token=' + mapboxToken, {
//			attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a> | <a href="/imprint">Impressum</a> | <a href="/copyright">Copyright</a> | <a href="/imprint">Kontakt</a>'
			attribution: '<a href="http://www.openstreetmap.org" target="_blank">OpenStreetMap-Mitwirkende</a>, <a href="https://www.mapbox.com" target="_blank">Mapbox</a>, <a href="http://tursics.de/imprint" target="_blank">Impressum</a>'
		});

		map = L.map( elementName, {zoomControl: false})
			.addLayer( mapboxTiles)
			.setView( [lat, lng], zoom);

		map.addControl( L.control.zoom({ position: 'bottomright'}));
//		map.on('click', mapAction);
//		map.on('mousedown', mapAction);
		map.on('dragstart', mapAction);
		map.on('zoomstart', mapAction);
		map.on('autopanstart', mapAction);

		var dataUrl = 'data/gebaeudescan.json';
		$.getJSON( dataUrl, function( data) {
			data = enrichMissingData( data);
			createStatistics( data);
			createMarker( data);
			initSearchBox( data);

			var budgetUrl = 'data/gebaeudesanierungen.json';
			$.getJSON( budgetUrl, function( budgetData) {
				budget = budgetData;
				logStatistics( data, budgetData);
			});
		});
	}
}

//-----------------------------------------------------------------------------

function initSearchBox( data)
{
	var schools = [];

	try {
		$.each( data, function( key, val) {
			if((typeof val.lat != 'undefined') && (typeof val.lng != 'undefined')) {
				var name = val.Schulname;
				if( '' !== val.Schulnummer) {
					name += ' (' + val.Schulnummer + ')';
				}
				schools.push({ value: name, data: val.Gebaeudenummer, color: '', desc: val.Bauwerk });
			}
		});
	} catch( e) {
		console.log(e);
	}

	schools.sort(function(a, b) {
		if( a.value === b.value) {
			return a.data > b.data ? 1 : -1;
		}

		return a.value > b.value ? 1 : -1;
	});

	$('#autocomplete').focus(mapAction);
	$('#autocomplete').autocomplete({
		lookup: schools,
		onSelect: function (suggestion) {
			selectSuggestion( suggestion.data);
		},
		formatResult: function (suggestion, currentValue) {
			var isSchool   = suggestion.desc.startsWith( 'Schul') || suggestion.desc.startsWith( 'Hauptgebäude') || suggestion.desc.startsWith( 'Altbau');
			var isSport    = suggestion.desc.startsWith( 'Sport');
			var isExt      = suggestion.desc.startsWith( 'MUR') || suggestion.desc.startsWith( 'MEB');
			var isMulti    = suggestion.desc.startsWith( 'MZG');
			var isDistrict = suggestion.desc.startsWith( 'Bezirk');
			var isTraffic  = suggestion.value.indexOf( 'verkehrsschule') !== -1;

			var color = isTraffic ? 'purple' :
						isSchool ? 'blue' :
						isSport ? 'orange' :
						isExt ? 'blue' :
						isMulti ? 'purple' :
						isDistrict ? 'gray' :
						'red';
			var icon  = isTraffic ? 'fa-car' :
						isSchool ? 'fa-user' :
						isSport ? 'fa-soccer-ball-o' :
						isExt ? 'fa-user-plus' :
						isMulti ? 'fa-building-o' :
						isDistrict ? 'fa-institution' :
						'fa-building-o';

			var str = '';
			str += '<div class="autocomplete-icon back' + color + '"><i class="fa ' + icon + '" aria-hidden="true"></i></div>';
			str += '<div>' + suggestion.value.replace( new RegExp( currentValue.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'gi'), '<strong>' + currentValue + '</strong>') + '</div>';
			str += '<div class="' + color + '">' + suggestion.desc + '</div>';
			return str;
		}
	});
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

		layerGroup = L.featureGroup([]);
		layerGroup.addTo(map);

		layerGroup.addEventListener( 'click', function( evt) {
			updateMapSelectItem( evt.layer.options.data);
		});
		layerGroup.addEventListener( 'mouseover', function( evt) {
			updateMapHoverItem( [evt.latlng.lat, evt.latlng.lng], evt.layer.options.data, evt.layer.options.icon);
		});
		layerGroup.addEventListener( 'mouseout', function( evt) {
			updateMapVoidItem( evt.layer.options.data);
		});

		$.each( data, function( key, val) {
			if((typeof val.lat != 'undefined') && (typeof val.lng != 'undefined')) {
				var isSchool   = val.Bauwerk.startsWith( 'Schul') || val.Bauwerk.startsWith( 'Hauptgebäude') || val.Bauwerk.startsWith( 'Altbau');
				var isSport    = val.Bauwerk.startsWith( 'Sport');
				var isExt      = val.Bauwerk.startsWith( 'MUR') || val.Bauwerk.startsWith( 'MEB');
				var isMulti    = val.Bauwerk.startsWith( 'MZG');
				var isDistrict = val.Bauwerk.startsWith( 'Bezirk');
				var isTraffic  = val.Schulname.indexOf( 'verkehrsschule') !== -1;
				var marker = L.marker([parseFloat( val.lat), parseFloat( val.lng)],{
					data: fixData(val),
					icon: isTraffic ? markerTraffic :
						isSchool ? markerSchool :
						isSport ? markerSport :
						isExt ? markerExtension :
						isMulti ? markerMulti :
						markerOthers,
					opacity: isDistrict ? 0 : 1,
					clickable: isDistrict ? 0 : 1
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
		} else if( 'number' === typeof item) {
			return item;
		} else if( 'T€' === item.substring( item.length - 2)) {
			return parseInt( item.substring( 0, item.length - 2).replace('.', '').replace(',', '.')) * 1000;
		}
		return item;
	}

	val.NGF = parseInt( val.NGF);
	val.BGF = fixComma( val.BGF);
	val.NF = fixComma( val.NF);
	val.Grundstuecksflaeche = fixComma( val.Grundstuecksflaeche);
	val.GebaeudeHoeheInM = fixComma( val.GebaeudeHoeheInM);
	val.GebaeudeUmfangInMAusConject = fixComma( val.GebaeudeUmfangInMAusConject);
	val.FassadenFlaeche = fixComma( val.FassadenFlaeche);
	val.Dachflaeche = fixComma( val.Dachflaeche);
	val.BWCAnzahl = fixComma( val.BWCAnzahl);
	val.RaeumeNutzflaecheBGF = parseInt( val.RaeumeNutzflaecheBGF);
	val.Sanitaerflaeche = fixComma( val.Sanitaerflaeche);
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
});

// -----------------------------------------------------------------------------

$( document).on( "pageshow", "#pageMap", function()
{
	// center the city hall
	initMap( 'mapContainer', 52.515807, 13.479470, 16);

	$( '#autocomplete').val( '');
	$( '#receipt .group').on( 'click', function( e) {
		$(this).toggleClass('groupClosed');
	});
	$( '#receiptClose').on( 'click', function( e) {
		$( '#receiptBox').css( 'display', 'none');
	});
	$( '#searchBox .sample a:nth-child(1)').on( 'click', function( e) {
		$( '#autocomplete').val( 'Obersee-Schule (11G19)');
		selectSuggestion( 1111901);
	});
	$( '#searchBox .sample a:nth-child(2)').on( 'click', function( e) {
		$( '#autocomplete').val( 'Lichtenberg');
		selectSuggestion( 1100000);
	});
});

// -----------------------------------------------------------------------------

function formatNumber( txt)
{
	txt = '' + parseInt( txt);
	var sign = '';
	if( txt[0] == '-') {
		sign = '-';
		txt = txt.slice( 1);
	}

	var pos = txt.length;
	while( pos > 3) {
		pos -= 3;
		txt = txt.slice(0, pos) + '.' + txt.slice(pos);
	}

	return sign + txt;
}

// -----------------------------------------------------------------------------

function updateMapSelectItem( data)
{
	function setText( key, txt) {
		var item = $( '#rec' + key);

		if( item.parent().hasClass( 'number')) {
			txt = formatNumber( txt);
		} else if( item.parent().hasClass( 'boolean')) {
			txt = (txt === 1 ? 'ja' : 'nein');
		}

		item.text( txt);
	}

	mapAction();

	for(var key in data) {
		setText( key, data[key]);
	}

	setText( 'FensterKosten_', data.FensterFaktorFlaechenanteil * data.FensterFlaeche * data.FensterKostenpauschale);
	setText( 'DachKosten_', data.Dachflaeche * data.DachKostenpauschale);
	setText( 'FassadenKosten_', data.FassadenFaktorFlaechenanteil * (data.FassadenFlaecheOhneFenster < 0 ? 0 : data.FassadenFlaecheOhneFenster) * data.FassadenKostenpauschale);
	setText( 'RaeumeKosten_', data.RaeumeNutzflaecheBGF * data.RaeumeKostenpauschale);
	setText( 'Raeume2NF_', data.NF - data.Sanitaerflaeche);
	setText( 'Raeume2Kosten_', data.Raeume2Nutzflaeche * data.Raeume2Kostenpauschale);
	setText( 'GebaeudeGesamt_', data.FensterKosten + data.FassadenKosten + data.DachKosten + data.ZwischensummeBarrierefreiheitKosten + data.zweiterRettungswegKosten + data.RaeumeKosten + data.SanitaerKosten + data.Baukosten + data.Aussenanlagen);

	setText( 'zweiterRettungswegKosten_', data.zweiterRettungswegKosten);
	setText( 'FassadenFlaecheOhneFenster_', data.FassadenFlaecheOhneFenster);
	setText( 'BGF_', data.BGF);
	setText( 'Baukosten_', data.Baukosten);

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
	setText( 'Now_', dateD + '.' + dateM + '.' + dateY + ' ' + dateH + ':' + dateMin);

	switch(data.PrioritaetGesamt) {
	case 1:
		setText( 'PrioritaetGesamt', 'kurzfrist. Handlungsbedarf');
		break;
	case 2:
		setText( 'PrioritaetGesamt', 'in den nächsten 3 Jahren');
		break;
	case 3:
		setText( 'PrioritaetGesamt', 'in den nächsten 10 Jahren');
		break;
	case 4:
		setText( 'PrioritaetGesamt', 'wünschenswert');
		break;
	case 5:
		setText( 'PrioritaetGesamt', 'niedrig');
		break;
	case 6:
		setText( 'PrioritaetGesamt', 'minimal');
		break;
	default:
		setText( 'PrioritaetGesamt', data.PrioritaetGesamt);
		break;
	}

	// unused rows
	//   BauPrioAussen
	//   SchulPrioFachraum
	//   SchulPrioSanitaer
	//   SchulPrioGanztagEssen
	//   SchulPrioSumme
	//   PrioritaetWertung
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

	$( '#receiptBox').css( 'display', 'block');

	var strThisYear = '';
	var intThisYear = 0;
	for(var id in budget) {
		var item = budget[id];
		if( item.Gebaeudenummer === data.Gebaeudenummer) {
			var kosten = parseFloat( String( item.Kostenansatz).replace('.', '').replace('.', '').replace(',', '.'));
			if( isNaN(kosten)) {
				kosten = 0;
			}
			intThisYear += kosten;
			strThisYear += '<div class="sub"><span class="fullwrap">' + item.Beschreibung + '</span></div>';
			strThisYear += '<div class="sub"><span class="half">' + item.Programm + ' ' + item.Jahr + '</span><span class="number">' + formatNumber( kosten) + ' EUR</span></div>';
		}
	}
	if( strThisYear.length > 0) {
		strThisYear = '<div><span class="half">Bau- und Sanierungsprogramme</span><span class="number">' + formatNumber( intThisYear) + ' EUR</span></div>' + strThisYear;
	}
	$('#thisYear').html(strThisYear);
}

// -----------------------------------------------------------------------------

function updateMapHoverItem( coordinates, data, icon)
{
	var options = {
		closeButton: false,
		offset: L.point(0,-32),
		className: 'printerLabel'
	};

	var str = '';
	str += '<div class="top ' + icon.options.markerColor + '">' + data.Schulname + '</div>';
	str += '<div class="middle">€' + formatNumber(data.GebaeudeGesamt) + '</div>';
	str += '<div class="bottom ' + icon.options.markerColor + '">' + data.Bauwerk + '</div>';

	layerPopup = L.popup(options)
		.setLatLng(coordinates)
		.setContent(str)
		.openOn(map);
}

// -----------------------------------------------------------------------------

function updateMapVoidItem( data)
{
	if (layerPopup && map) {
		map.closePopup(layerPopup);
		layerPopup = null;
    }
}

// -----------------------------------------------------------------------------

function createStatistics( data)
{
	var obj = {
		Bauwerk: 'Bezirk', Dachart: 'Diverse', Schulart: 'Bezirk', Schulname: 'Lichtenberg',
		Schulnummer: '', Strasse: '', PLZ: '', Gebaeudenummer: 1100000, lat: 52.515807,
		lng: 13.479470, GebaeudeHoeheInM: 0, GebaeudeUmfangInMAusConject: 0,
		FensterKostenpauschale: 0, FassadenKostenpauschale: 0, DachKostenpauschale: 0,
		RaeumeKostenpauschale: 0, Raeume2Kostenpauschale: 0, SanierungDachNotwendig: 1,
		SanierungFassadenNotwendig: 1, SanierungFensterNotwendig: 1, SanierungRaeume2Notwendig: 1,
		SanierungRaeumeNotwendig: 1, SanierungTuerbreitenNotwendig: 1, SanitaerSanierungsjahr: '-'
	};
	var sum = [
		'AufzugKosten','BGF','BWCAnzahl','BWCKosten','DachKosten','EingangAnzahl','EingangKosten',
		'FassadenKosten','FensterKosten','FlaecheNichtSaniert','GF','GebaeudeGesamt',
		'Grundstuecksflaeche','NF','NGF','Raeume2Kosten','RaeumeKosten','RampeAnzahl',
		'RampeKosten','SanitaerKosten','Sanitaerflaeche','ZwischensummeBarrierefreiheitKosten',
		'zweiterRettungswegKosten','Baukosten','Aussenanlagen'
	];
	var sumCond = [
		{calc: 'FensterFlaeche', condition: 'FensterKosten' /*'SanierungFensterNotwendig'*/},
		{calc: 'FassadenFlaeche', condition: 'FassadenKosten' /*'SanierungFassadenNotwendig'*/},
		{calc: 'FassadenFlaecheOhneFenster', condition: 'FassadenKosten' /*'SanierungFassadenNotwendig'*/},
		{calc: 'Dachflaeche', condition: 'DachKosten' /*'SanierungDachNotwendig'*/},
		{calc: 'TuerenKosten', condition: 'SanierungTuerbreitenNotwendig'},
		{calc: 'RaeumeNutzflaecheBGF', condition: 'RaeumeKosten' /*'SanierungRaeumeNotwendig'*/},
		{calc: 'Raeume2Nutzflaeche', condition: 'Raeume2Kosten' /*'SanierungRaeume2Notwendig'*/}
	];
	var average = [
		'FassadenFaktorFlaechenanteil','FensterFaktorFlaechenanteil','BauPrioBauwerk','BauPrioTGA',
		'BauprioSumme','PrioritaetGesamt','bereitsSanierteFlaecheInProzent'
	];

	for(var id in sum) {
		obj[sum[id]] = 0;
	}
	obj.FensterFlaeche = 0;
	obj.FassadenFlaeche = 0;
	obj.FassadenFlaecheOhneFenster = 0;
	obj.Dachflaeche = 0;
	obj.TuerenKosten = 0;
	obj.RaeumeNutzflaecheBGF = 0;
	obj.Raeume2Nutzflaeche = 0;
	for(var id in average) {
		obj[average[id]] = 0;
	}

	try {
		$.each( data, function( key, val) {
			var val = fixData(val);
			if((typeof val.lat != 'undefined') && (typeof val.lng != 'undefined')) {
				for(var id in val) {
					if( -1 < $.inArray( id, sum)) {
						obj[id] += parseInt(val[id]);
					} else if( -1 < $.inArray( id, average)) {
						obj[id] += parseInt(val[id]);
					} else {
						for(var cond in sumCond) {
							if(( sumCond[cond].calc === id) && (0 !== val[sumCond[cond].condition])) {
								obj[id] += parseInt(val[id]);
							}
						}
					}
				}
			}
		});

		var len = data.length;
		for(var id in obj) {
			if( -1 < $.inArray( id, average)) {
				obj[id] = parseInt( obj[id] / len * 10) / 10;
			}
		}

		obj.FensterKostenpauschale = parseInt( obj.FensterKosten / obj.FensterFaktorFlaechenanteil / obj.FensterFlaeche * 100) / 100;
		obj.FassadenKostenpauschale = parseInt( obj.FassadenKosten / obj.FassadenFaktorFlaechenanteil / obj.FassadenFlaecheOhneFenster * 100) / 100;
		obj.DachKostenpauschale = parseInt( obj.DachKosten / obj.Dachflaeche * 100) / 100;
		obj.RaeumeKostenpauschale = parseInt( obj.RaeumeKosten / obj.RaeumeNutzflaecheBGF * 100) / 100;
		obj.Raeume2Kostenpauschale = parseInt( obj.Raeume2Kosten / obj.Raeume2Nutzflaeche * 100) / 100;
		obj.bereitsSanierteFlaecheInProzent = parseInt( obj.bereitsSanierteFlaecheInProzent);

		data.push(obj);
	} catch( e) {
		console.log(e);
	}
}

// -----------------------------------------------------------------------------

function enrichMissingData( data)
{
	try {
		$.each( data, function( key, value) {
			var val = fixData(value);
			if((typeof val.lat != 'undefined') && (typeof val.lng != 'undefined')) {
				var sum1 = val.GebaeudeGesamt;
				var sum2 = val.FensterKosten + val.FassadenKosten + val.DachKosten + val.ZwischensummeBarrierefreiheitKosten + val.zweiterRettungswegKosten + val.RaeumeKosten + val.SanitaerKosten;
				var diff = sum1 - sum2;
				var isSport = val.Bauwerk.startsWith( 'Sport');
				var isSchool = !isSport && (val.Bauwerk.indexOf( 'chul') !== -1);

				val.Aussenanlagen = 0;
				val.Baukosten = 0;

				if( isSchool && (diff > 1000)) {
					val.Aussenanlagen = diff;
				} else if( isSport && (diff > 1000)) {
					val.Baukosten = diff;
				}
			}
		});
	} catch( e) {
		console.log(e);
	}

	return data;
}

// -----------------------------------------------------------------------------

function logStatistics( data, budgetData)
{
	try {
		var sumDiff = 0;
		$.each( data, function( key, val) {
			if((typeof val.lat != 'undefined') && (typeof val.lng != 'undefined')) {
				var sum1 = val.GebaeudeGesamt;
				var sum2 = val.FensterKosten + val.FassadenKosten + val.DachKosten + val.ZwischensummeBarrierefreiheitKosten + val.zweiterRettungswegKosten + val.RaeumeKosten + val.SanitaerKosten + val.Baukosten + val.Aussenanlagen;
				var diff = sum1 - sum2;
				var isSport = val.Bauwerk.startsWith( 'Sport');
				var isSchool = !isSport && (val.Bauwerk.indexOf( 'chul') !== -1);

				if( isSport) {
					sumDiff += diff;
					if( diff > 1000) {
						if( diff == 1800000) {
							// 436 <= val.GF <= 454
//							console.log( val.Schulname + ': ' + val.GF);
						} else if( diff == 2100000) {
							// 743 <= val.GF <= 765
//							console.log( val.Schulname + ': ' + val.GF);
						} else if( diff == 3200000) {
							// 1160 <= val.GF <= 1174 + 1783
//							console.log( val.Schulname + ': ' + val.GF);
						} else {
//							console.log( val.Schulname + ': ' + val.Bauwerk);
//							console.log( val.Schulname + ': ' + val.GF+ ' qm');
//							console.log( sum1/1000 + 'T€ - ' + sum2/1000 + 'T€ = ' + diff/1000 + 'T€');
//							console.log( val.Grundstuecksflaeche + ' qm Grundstück');
//							console.log( parseInt(diff / (val.Grundstuecksflaeche - val.GF)) + ' €/qm');
/*
827T€
Randow-Schule: 756

1840T€
Mildred-Harnack-Schule: 850

2137T€
Manfred-von-Ardenne-Gymnasium: 757
2184T€
Manfred-von-Ardenne-Gymnasium: 757
2195T€
Alexander-Puschkin-Schule: 757
2484T€
Filiale Paul-Schmidt-Schule: 756

3360T€
Alexander-Puschkin-Schule: 1167
*/
						}
					}
				}
/*				if( !isSport) {
					sumDiff += diff;
					if( diff > 1000) {
//						console.log( val.Schulname + ': ' + val.Bauwerk);
//						console.log( sum1/1000 + 'T€ - ' + sum2/1000 + 'T€ = ' + diff/1000 + 'T€');
					}
				}*/
			}
		});
//		console.log('Sum: ' + sumDiff/1000000 + ' mio');
//		console.log(budgetData);
	} catch( e) {
		console.log(e);
	}
}

// -----------------------------------------------------------------------------

function selectSuggestion( selection)
{
	$.each( layerGroup._layers, function( key, val) {
		if( val.options.data.Gebaeudenummer === selection) {
			map.panTo( new L.LatLng( val.options.data.lat, val.options.data.lng));
			updateMapSelectItem( val.options.data);
		}
	});
}

// -----------------------------------------------------------------------------

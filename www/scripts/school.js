/*
*/

var map = null;
var layerPopup = null;
var layerGroup = null;

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
			createStatistics( data);
			createMarker( data);
			initSearchBox( data);
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

	val.NGF = fixComma( val.NGF);
	val.BGF = fixComma( val.BGF);
	val.NF = fixComma( val.NF);
	val.Grundstuecksflaeche = fixComma( val.Grundstuecksflaeche);
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

	for(var key in data) {
		setText( key, data[key]);
	}

	setText( 'FensterKosten_', data.FensterFaktorFlaechenanteil * data.FensterFlaeche * data.FensterKostenpauschale);
	setText( 'DachKosten_', data.Dachflaeche * data.DachKostenpauschale);
	setText( 'FassadenKosten_', data.FassadenFaktorFlaechenanteil * (data.FassadenFlaecheOhneFenster < 0 ? 0 : data.FassadenFlaecheOhneFenster) * data.FassadenKostenpauschale);
	setText( 'RaeumeKosten_', data.RaeumeNutzflaecheBGF * data.RaeumeKostenpauschale);
	setText( 'Raeume2NF_', data.NF - data.Sanitaerflaeche);
	setText( 'Raeume2Kosten_', data.Raeume2Nutzflaeche * data.Raeume2Kostenpauschale);
	setText( 'GebaeudeGesamt_', data.FensterKosten + data.FassadenKosten + data.DachKosten + data.ZwischensummeBarrierefreiheitKosten + data.zweiterRettungswegKosten + data.RaeumeKosten + data.SanitaerKosten);

	setText( 'zweiterRettungswegKosten_', data.zweiterRettungswegKosten);
	setText( 'FassadenFlaecheOhneFenster_', data.FassadenFlaecheOhneFenster);
	setText( 'BGF_', data.BGF);

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
		setText( 'PrioritaetGesamt', '1 (dringend)');
		break;
	case 2:
		setText( 'PrioritaetGesamt', '2 (sehr hoch)');
		break;
	case 3:
		setText( 'PrioritaetGesamt', '3 (hoch)');
		break;
	case 4:
		setText( 'PrioritaetGesamt', '4 (normal)');
		break;
	case 5:
		setText( 'PrioritaetGesamt', '5 (niedrig)');
		break;
	case 6:
		setText( 'PrioritaetGesamt', '6 (minimal)');
		break;
	default:
		setText( 'PrioritaetGesamt', data.PrioritaetGesamt);
		break;
	}

	$( '#receipt').css( 'display', 'block');

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

	$( '#receiptInfo').css( 'display', 'block');
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
		Bauwerk: 'Bezirk', Dachart: 'Diverse',
		Schulart: 'Bezirk', Schulname: 'Lichtenberg', Schulnummer: '', Strasse: '', PLZ: '',
		Gebaeudenummer: 1100000, lat: 52.515807, lng: 13.479470,
		GebaeudeHoeheInM: 0, GebaeudeUmfangInMAusConject: 0, FensterKostenpauschale: 0,
		SanierungDachNotwendig: 1, SanierungFassadenNotwendig: 1, SanierungFensterNotwendig: 1,
		SanierungRaeume2Notwendig: 1, SanierungRaeumeNotwendig: 1, SanierungTuerbreitenNotwendig: 1,
		SanitaerSanierungsjahr: ''
	};
	var sum = [
		'AufzugKosten',
		'BGF','BWCAnzahl','BWCKosten',
		'DachKosten','Dachflaeche',
		'EingangAnzahl','EingangKosten',
		'FassadenFlaeche','FassadenFlaecheOhneFenster','FassadenKosten',
		'FensterKosten','FlaecheNichtSaniert',
		'GF','GebaeudeGesamt','Grundstuecksflaeche','NF','NGF',
		'Raeume2Kosten','Raeume2Nutzflaeche','RaeumeKosten','RaeumeNutzflaecheBGF',
		'RampeAnzahl','RampeKosten',
		'SanitaerKosten','Sanitaerflaeche',
		'TuerenKosten','ZwischensummeBarrierefreiheitKosten','bereitsSanierteFlaecheInProzent',
		'zweiterRettungswegKosten'
	];
	var sumCond = [
		{calc: 'FensterFlaeche', condition: 'FensterKosten' /*'SanierungFensterNotwendig'*/}
	];
	var average = ['DachKostenpauschale','FassadenFaktorFlaechenanteil','FassadenKostenpauschale',
		'FensterFaktorFlaechenanteil',
		'BauPrioBauwerk','BauPrioTGA','BauprioSumme','PrioritaetGesamt',
		'Raeume2Kostenpauschale','RaeumeKostenpauschale'
	];

	for(var id in sum) {
		obj[sum[id]] = 0;
	}
	obj.FensterFlaeche = 0;
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

		data.push(obj);
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

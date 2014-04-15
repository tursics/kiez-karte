/*
	Drag'n'Drop
*/

// -----------------------------------------------------------------------------
// http://www.html5rocks.com/en/tutorials/file/dndfiles/
// http://www.htmlgoodies.com/html5/javascript/drag-files-into-the-browser-from-the-desktop-HTML5.html#fbid=NRudD56hfes
// -----------------------------------------------------------------------------

function initDragnDrop()
{
	var dropZone = document.getElementById( 'mapContainer');
	dropZone.addEventListener( 'dragstart', dndHandleDragStart, false);
	dropZone.addEventListener( 'dragenter', dndHandleDragEnter, false);
	dropZone.addEventListener( 'dragover', dndHandleDragOver, false);
	dropZone.addEventListener( 'dragleave', dndHandleDragLeave, false);
	dropZone.addEventListener( 'drop', dndHandleDrop, false);

	document.body.addEventListener( 'dragover', dndHandleDragOver, false);
	document.body.addEventListener( 'drop', dndHandleDrop, false);
}

// -----------------------------------------------------------------------------

function dndHandleDragStart( evt)
{
	evt.dataTransfer.effectAllowed = 'copy';
}

// -----------------------------------------------------------------------------

function dndHandleDragEnter( evt)
{
	if( !$.mobile.activePage.find( '.popupDrop').parent().hasClass( 'ui-popup-active')) {
		$( '#popupDrop').popup( 'open');
	}
}

// -----------------------------------------------------------------------------

function dndHandleDragOver( evt)
{
	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.dropEffect = 'copy';

	$( '#popupDrop').html(
		'<div style="margin:2em 4em 2em 4em;text-shadow:none;">' +
		'<div style="font-size:3em;text-align:center;margin-bottom:0.5em;"><i class="fa fa-file-text-o"></i></div>' +
		'Du hast eine Datei? Klasse, dann lasse sie auf der Karte fallen.' +
		'</div>');
	$( '#popupDrop').popup( 'reposition', {positionTo: "window"});

	return false;
}

// -----------------------------------------------------------------------------

function dndHandleDragLeave( evt)
{
	$( '#popupDrop').popup( 'close');
}

// -----------------------------------------------------------------------------

function dndHandleDrop( evt)
{
	evt.stopPropagation();
	evt.preventDefault();

	if( 1 == evt.dataTransfer.files.length) {
		dndHandleNewFile( evt.dataTransfer.files[ 0]);
	} else {
		$( '#popupDrop').html(
			'<div style="margin:2em 4em 2em 4em;text-shadow:none;">' +
			'<div style="font-size:3em;text-align:center;margin-bottom:0.5em;"><i class="fa fa-files-o"></i></div>' +
			evt.dataTransfer.files.length + ' Dateien? So viele? Bitte ziehe nur einzelne Dateien hier her. Danke.' +
			'</div>');
		$( '#popupDrop').popup( 'reposition', {positionTo: "window"});
	}

	return false;
}

// -----------------------------------------------------------------------------

function dndHandleNewFile( f)
{
	var errorImg = '';
	var errorTxt = '';

	if( f.type.match( 'image.*')) {
		errorImg = 'fa-picture-o';
		errorTxt = 'Ein Bild? Nein.';
	} else if( f.type.match( 'application/pdf')) {
		errorImg = 'fa-file';
		errorTxt = 'Eine PDF-Datei, so, so. Was soll ich damit?';
	} else if( !f.type.match( 'text.*')) {
		errorImg = 'fa-file-o';
		errorTxt = 'Ist diese Datei Open Data freundlich?';
	}

	if( 0 != errorTxt.length) {
		$( '#popupDrop').html(
			'<div style="margin:2em 4em 2em 4em;text-shadow:none;">' +
			'<div style="font-size:3em;text-align:center;margin-bottom:0.5em;"><i class="fa ' + errorImg + '"></i></div>' +
			errorTxt + ' Bitte nur CSV-Dateien hier her ziehen.' +
			'</div>');
		$( '#popupDrop').popup( 'reposition', {positionTo: "window"});

        return;
	}

	dndReadTextFile( f);
}

// -----------------------------------------------------------------------------

function dndReadErrorHandler( evt)
{
	switch( evt.target.error.code) {
	case evt.target.error.NOT_FOUND_ERR:
		alert( 'File Not Found!');
		break;
	case evt.target.error.NOT_READABLE_ERR:
		alert( 'File is not readable');
		break;
	case evt.target.error.ABORT_ERR:
		break; // noop
	default:
		alert( 'An error occurred reading this file.');
	};
}

// -----------------------------------------------------------------------------

function dndReadUpdateProgress( evt)
{
	if( evt.lengthComputable) {
		var percentLoaded = Math.round(( evt.loaded / evt.total) * 100);

		if( percentLoaded < 100) {
//			progress.style.width = percentLoaded + '%';
//			progress.textContent = percentLoaded + '%';
		}
	}
}

// -----------------------------------------------------------------------------

var dndReader = null;

function dndReadTextFile( f)
{
//	progress.style.width = '0%';
//	progress.textContent = '0%';

	dndReader = new FileReader();
	dndReader.onerror = dndReadErrorHandler;
	dndReader.onprogress = dndReadUpdateProgress;
	dndReader.onabort = function( e) {
		alert( 'File read cancelled');
	};
	dndReader.onloadstart = function( e) {
//		document.getElementById( 'progress_bar').className = 'loading';
	};
	dndReader.onload = function( e) {
		// Ensure that the progress bar displays 100% at the end.
//		progress.style.width = '100%';
//		progress.textContent = '100%';
//		setTimeout( "document.getElementById( 'progress_bar').className='';", 2000);
		$( '#popupDrop').html(
			'<div style="margin:0;text-shadow:none;">' +
			e.target.result +
			'</div>');
		$( '#popupDrop').popup( 'reposition', {positionTo: "window"});
	}

	var str = '';
	str += '<strong>' + escape( f.name) + '</strong><br>';
	str += (f.type || 'n/a') + '<br>';
	str += f.size + ' bytes<br>';
	str += 'Last modified: ' + (f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a');

	$( '#popupDrop').html(
		'<div style="margin:2em 4em 2em 4em;text-shadow:none;">' +
		'<div style="font-size:3em;text-align:center;margin-bottom:0.5em;"><i class="fa fa-table"></i></div>' +
		str +
		'</div>');
	$( '#popupDrop').popup( 'reposition', {positionTo: "window"});

	dndReader.readAsText( f);
}

// -----------------------------------------------------------------------------

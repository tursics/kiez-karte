<?php
	// -----------------------------------------------------------------------------------
	function fetchStatisticData( $rbsPath)
	{
		// RBS-Adressen Dezember 2014
		// Lizenz: Creative Commons Namensnennung CC-BY License
		// Veröffentlichende Stelle: Amt für Statistik Berlin-Brandenburg
		// spec: https://www.statistik-berlin-brandenburg.de/opendata/Beschreibung_RBS_OD_ADR.pdf
		$path = 'http://daten.berlin.de/datensaetze/rbs-adressen-dezember-2014';

		if( !file_exists( $rbsPath)) {
			$metadata = getInfoPageMetadata( $path);
			if( null !== $metadata['ressources']) {
				foreach( $metadata['ressources'] as $resource) {
					if( false !== strpos( $resource, '.csv')) {
						$contents = file_get_contents( $resource);
						$fp = fopen( $rbsPath, 'w');
						fwrite( $fp, $contents);
						fclose( $fp);
						break;
					}
				}
			}
		}
	}
	// -----------------------------------------------------------------------------------
	function fetchGeoData( $houseZIPPath, $housePath)
	{
		// Hauskoordinaten Berlin
		// Nutzungsbedingungen: Für die Verwendung der Daten gelten folgende Nutzungsbestimmungen: http://www.stadtentwicklung.berlin.de/geoinformation/download/nutzIII.pdf - Der Quellenvermerk gemäß §2 lautet "Geoportal Berlin / [Titel des Datensatzes]".
		// spec: http://fbinter.stadt-berlin.de/fb_daten/beschreibung/datenformatbeschreibung/Datenformatbeschreibung-HK-Version_3.1.pdf
		$path = 'http://fbarc.stadt-berlin.de/FIS_Broker_Atom/Hauskoordinaten/HKO_EPSG5650.zip';

		if( !file_exists( $houseZIPPath)) {
			$contents = file_get_contents( $path);
			$fp = fopen( $houseZIPPath, 'w');
			fwrite( $fp, $contents);
			fclose( $fp);

		}

		if( !file_exists( $housePath)) {
			$za = new ZipArchive();
			$za->open( $houseZIPPath);
			if( 1 == $za->numFiles) {
				$stat = $za->statIndex( 0);
				$stream = $za->getStream( $stat['name']);
				$fp = fopen( $housePath, 'w');

				while( !feof( $stream)) {
					fwrite( $fp, fread( $stream, 2048));
				}

				fclose( $stream);
				fclose( $fp);
				$za->close();
			}
		}
	}
	// -----------------------------------------------------------------------------------
	function updateGeo()
	{
		global $base_dir;

		$rbsPath = $base_dir.'/geo-data-rbs.csv';
		fetchStatisticData( $rbsPath);

		$houseZIPPath = $base_dir.'/geo-data-house.zip';
		$housePath = $base_dir.'/geo-data-house.txt';
		fetchGeoData( $houseZIPPath, $housePath);

/*
house.txt - Western (Windows Latin 1)
NBA;OI;QUA;LAN;RBZ;KRS;GMD;OTT;SSS;HNR;ADZ;EEEEEEEE_EEE;NNNNNNN_NNN;STN;PLZ;ONM;ZON;POT;PSN;AND
N;DEBE000000000001;A;11;0;00;004;0402;00001;1;;33385802,013;5816000,099;Aachener Straße;10713;Berlin;;;;2015-04-02

rbs.csv - Western (Windows Latin 1)
STRNR;STRNAME;HSNR;PLZ;BLK;ORTST;STG;PLR;BEZ;X_03068;Y_03068;X_25833;Y_25833;HKO;FIX;
00001;Aachener Straße;001;10713;044205;0402;044;04051551;04;0000191375;0000172702;385802,01;5816000,10;1;0;
*/

	}
	// -----------------------------------------------------------------------------------
?>

<?php
	// -------------------------------------------------------------------------
	// Datenformatbeschreibung Hauskoordinaten Deutschland
	// Version: 3.1
	// Date:    2013-07-01
	// Format:  ISO 8859/1 (ISO Latin-1)
	// -------------------------------------------------------------------------
	// Sample:
	// N;DEBE000000740554;A;11;0;00;011;1101;40148;7;;13,520049;52,508027;Am Tierpark;10315;Berlin;;;;16.04.2014;
	// -------------------------------------------------------------------------
	// NBA (Kennung des Datensatzes)                       [1 char]
	//   "N" neu, "L" zu löschen, "A" geändert
	//   N
	// OI (Eindeutige Nummer des Datensatzes)              [string, 16 chars]
	//   DEBE000000740554
	// QUA (Qualität der georeferenzierten Gebäudeadresse) [1 char]
	//   Koordinaten "A" innerhalb Gebäude, "B" innerhalb Flurstück, "R" Gebäude evtl. nicht vorhanden
	//   A
	// LAN (Schlüssel Land)                                [2 chars]
	//   11
	// RBZ (Schlüssel Regierungsbezirk)                    [1 char]
	//   0
	// KRS (Schlüssel Kreis/kreisfreie Stadt)              [2 chars]
	//   00
	// GMD (Schlüssel Gemeinde)                            [3 chars]
	//   011
	// OTT (Schlüssel des Orts- bzw. Gemeindeteils)        [4 chars]
	//   1101
	// SSS (Schlüssel der Straße)                          [5 chars]
	//   40148
	// HNR (Hausnummer)                                    [string]
	//   7
	// ADZ (Adressierungszusatz)                           [string]
	//
	// (1. Koordinatenwert ETRS89/UTM, East-Wert)          [fixed 8,3]
	//   13,520049
	// (2. Koordinatenwert ETRS89/UTM, North-Wert)         [fixed 7,3]
	//   52,508027
	// STN (unverschlüsselter Straßenname)                 [string]
	//   Am Tierpark
	// PLZ (Postleitzahl)                                  [string, 5 chars]
	//   10315
	// ONM (Postalischer Ortsname)                         [string]
	//   Berlin
	// ZON (Zusatz zum postalischen Ortsnamen)             [string]
	//
	// POT (Postalischer Ortsteil)                         [string]
	//
	// ???
	//
	// ???
	//   16.04.2014
	// -------------------------------------------------------------------------

	$ret = array();

	if( !isset( $_GET[ 'street'])) {
		$ret[ error] = "Parameter 'street' missing.";
	} else {
		$street = strtolower( utf8_decode( $_GET[ 'street']));
		$streetNumber = '';
		$streetAdd = '';
		if( preg_match( '/(.+)\s([\d]+)([^\d]*)/i', $street, $result)) {
			$street = trim( $result[1]);
			$streetNumber = trim( $result[2]);
			$streetAdd = trim( $result[3]);
		}
		// "Erieseering 4 - 6" => "Erieseering 4"
		// "Erieseering 4 / 6" => "Erieseering 4"
		if(( '-' == substr( $street, -1)) || ('/' == substr( $street, -1))) {
			if( preg_match( '/(.+)\s([\d]+)/i', $street, $result)) {
				$street = trim( $result[1]);
				$streetNumber = trim( $result[2]);
			}
		}
		// "Erieseering 4-6" => "Erieseering 4"
		// "Erieseering 4/6" => "Erieseering 4"
		if(( '-' == $streetAdd) || ('/' == $streetAdd)) {
			$streetAdd = '';
		}
		// Privatstraße 7, Nr. 18
		if( ', nr.' == substr( $street, -5)) {
			$street = substr( $street, 0, -5);
		}
		// Privatstraße 7 Nr. 18
		if( 'nr.' == substr( $street, -3)) {
			$street = substr( $street, 0, -3);
		}
		// "Charlottenstr." => "Charlottenstraße"
		if( 'str.' == substr( $street, -4)) {
			$street = substr( $street, 0, -1) . utf8_decode( 'aße');
		}
		// "Josef \u2013 Orlopp \u2013 Str." => "Josef - Orlopp - Str."
		$street = str_replace ( utf8_decode( '–'), '-', $street);
		$street = preg_replace( '/\s+/', '', $street);

		if( !isset( $_GET[ 'zip'])) {
			$ret[ error] = "Parameter 'zip' missing.";
		} else {
			$zip = utf8_decode( $_GET[ 'zip']);

			if( !in_array(( int) $zip, array( 10315, 10317, 10318, 10319, 10365, 10367, 10369, 13051, 13053, 13055, 13057, 13059))) {
				$ret[ error] = "Zip is outside Berlin-Lichtenberg";
				$ret[ errorCode] = 12;
			} else {
				if( !isset( $_GET[ 'city'])) {
					$ret[ error] = "Parameter 'city' missing.";
				} else {
					$city = utf8_decode( $_GET[ 'city']);

					$path = "../data/HKO_Lichtenberg_Geographisch_140416.txt";
					if( !file_exists( $path)) {
						$ret[ error] = "Internal error.";
					} else {
//						$content = explode( "\n", file_get_contents( $path));
						$content = file( $path);

						foreach( $content as $line) {
							$rows = explode( ";", $line);
							if( count( $rows) > 15) {
								$dataHNR = strtolower( $rows[9]);
								$dataADZ = strtolower( $rows[10]);
								$dataLng = str_replace( ',', '.', $rows[11]);
								$dataLat = str_replace( ',', '.', $rows[12]);
								$dataSTN = preg_replace( '/\s+/', '', strtolower( $rows[13]));
								$dataPLZ = $rows[14];
								$dataONM = $rows[15];

								if(( $dataSTN == $street) && ($dataHNR == $streetNumber) && ($dataADZ == $streetAdd)) {
									$ret[ street] = utf8_encode( $rows[13] . ' ' . $rows[9] . $rows[10]);
									$ret[ zip] = utf8_encode( $dataPLZ);
									$ret[ city] = utf8_encode( $dataONM);
									$ret[ lng] = $dataLng;
									$ret[ lat] = $dataLat;
								}
							}
						}

						if( count( $ret) == 0) {
							$ret[ error] = "Could not geocode given address.";
							$ret[ errorCode] = 10;
							$ret[ error] = "Could not geocode given address: " . utf8_encode( $street) . " | $streetNumber | $streetAdd";
						}
					}
				}
			}
		}
	}

	echo json_encode( $ret);
?>

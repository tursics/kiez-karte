<?php
	$baseUrl = 'https://www.buergerhaushalt-lichtenberg.de';

	function submitRequest( $post, $subUrl)
	{
		global $baseUrl;

		$ua = 'Mozilla/5.0 (Windows NT 5.1; rv:16.0) Gecko/20100101 Firefox/16.0 (kiez-karte.berlin wizard)';
		$url = $baseUrl . $subUrl;

		$ch = curl_init();
		curl_setopt( $ch, CURLOPT_URL,            $url);
//		curl_setopt( $ch, CURLOPT_REFERER,        $url_ref);
		curl_setopt( $ch, CURLOPT_USERAGENT,      $ua);
//		curl_setopt( $ch, CURLOPT_COOKIEFILE,     $cookiefile);
//		curl_setopt( $ch, CURLOPT_COOKIEJAR,      $cookiefile);
		curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, true);
		curl_setopt( $ch, CURLOPT_NOBODY,         false);
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt( $ch, CURLOPT_BINARYTRANSFER, true);

		$coded = array();
		foreach( $post as $key => $value) {
			$coded[] = $key . '=' . urlencode( $value);
		}
		$str = implode( '&', $coded);
		curl_setopt( $ch, CURLOPT_POST,       true);
		curl_setopt( $ch, CURLOPT_POSTFIELDS, $str);

//		print_r(array_values($coded));

		$ret = curl_exec( $ch);
		curl_close( $ch);

		return $ret;
	}

	function checkError( $html)
	{
		$div = explode( '<div class="messages error">', $html);
		$ret = '';

		if( count( $div) > 1) {
			$div = explode( '</div>', $div[1])[0];

			$list = explode( '<li>', $div);
			if( count( $list) > 1) {
				for( $i = 1; $i < count( $list); ++$i) {
					$msg = explode( '</li>', $list[$i])[0];
					$ret .= $msg.'<br>';
					//There was a problem with your form submission. Please wait 21 seconds and try again.
					//Das Feld „Überschrift” ist erforderlich.
					//Es wurde eine nicht erlaubte Auswahl entdeckt. Wenden Sie sich bitte an den Administrator der Website.
					//Die Datei foo.jpg konnte nicht gespeichert werden, weil die maximal zulässige Größe von 2 MB für hochgeladene Dateien überschritten wurde.
					//Die Datei im Feld Bild konnte nicht hochgeladen werden.
					//Der Name tursics ist leider schon vergeben.
				}
			} else {
				$msg = explode( '</h2>', $div)[1];
				$ret .= $msg.'<br>';
			}
		}

		return $ret;
	}

	function checkLogin( $html)
	{
		$div = explode( 'id="js-login-btn"', $html);
		$ret = '';

		if( count( $div) > 1) {
			$ret .= 'Not logged in<br>';
		}

		return $ret;
	}

	function lor2district( $lor)
	{
		$ret = array( value => '_none', name => '- Keine -');

		switch( intval( $lor)) {
		case 11: // Lichtenberg
			$ret = array( value => '43', name => 'Lichtenberg (gesamt)');
			break;
		case 11010101: // Dorf Malchow
		case 11010102: // Dorf Wartenberg
		case 11010103: // Dorf Falkenberg
			$ret = array( value => '39', name => 'Malchow, Wartenberg und Falkenberg');
			break;
		case 11010204: // Falkenberg Ost
		case 11010205: // Falkenberg West
		case 11010206: // Wartenberg Sued
		case 11010207: // Wartenberg Nord
			$ret = array( value => '38', name => 'Neu-Hohenschönhausen Nord');
			break;
		case 11010308: // Zingster Strasse Ost
		case 11010309: // Zingster Strasse West
		case 11010310: // Muehlengrund
			$ret = array( value => '46', name => 'Neu-Hohenschönhausen Süd');
			break;
		case 11020411: // Malchower Weg
		case 11020412: // Hauptstrasse
			$ret = array( value => '44', name => 'Alt-Hohenschönhausen Nord');
			break;
		case 11020513: // Orankesee
		case 11020514: // Grosse-Leege-Strasse
		case 11020515: // Landsberger Allee
		case 11020516: // Weisse Taube
			$ret = array( value => '48', name => 'Alt-Hohenschönhausen Süd');
			break;
		case 11030617: // Hohenschoenhausener Strasse
		case 11030618: // Fennpfuhl West
		case 11030619: // Fennpfuhl Ost
			$ret = array( value => '45', name => 'Fennpfuhl');
			break;
		case 11030720: // Herzbergstrasse
		case 11030721: // Ruedigerstrasse
			$ret = array( value => '47', name => 'Alt-Lichtenberg');
			break;
		case 11030824: // Frankfurter Allee Sued
			$ret = array( value => '36', name => 'Frankfurter Allee Süd');
			break;
		case 11040925: // Victoriastadt
		case 11040926: // Weitlingstrasse
			$ret = array( value => '41', name => 'Neu-Lichtenberg');
			break;
		case 11041022: // Rosenfelder Ring
		case 11041023: // Gensinger Strasse
		case 11041027: // Tierpark
			$ret = array( value => '40', name => 'Friedrichsfelde Nord');
			break;
		case 11041128: // Sewanstrasse
			$ret = array( value => '37', name => 'Friedrichsfelde Süd');
			break;
		case 11051229: // Rummelsburg
			$ret = array( value => '42', name => 'Rummelsburger Bucht');
			break;
		case 11051330: // Karlshorst West
		case 11051331: // Karlshorst Nord
		case 11051332: // Karlshorst Sued
			$ret = array( value => '35', name => 'Karlshorst');
			break;
		}

		return $ret;
	}

	function submit( $title, $comment, $topic, $lor, $address, $lat, $lng)
	{
		echo 'Submit a civic budget Berlin<br>';
		echo '<br>';

		$district = lor2district( $lor);

		// 0 - - Keine -
		// 53 - Bibliotheken
		// 54 - Gesundheit
		// 55 - Kinder & Jugend
		// 56 - Kultur
		// 57 - Musikschule
		// 58 - Oeffentliches Strassenland
		// 59 - Senioren
		// 60 - Sport
		// 61 - Stadtteilprojekte
		// 62 - Themenuebergreifend
		// 63 - Umwelt & Natur
		// 64 - Volkshochschule
		// 65 - Wirtschaftsfoerderung
		if( 0 == intval( $topic)) {
			$topic = '_none';
		}

		$services = array(
			// mandatory fields
			"form_id" => "proposal_node_form",
			"title" => $title,
			"edit[title]" => $title,
			"field_proposal_district[und]" => $district['value'],
			"edit[field_proposal_district][und][term]" => $district['name'],
			"honeypot_time" => (time() - 60), // 'honey' send a unix timestamp but the submission time must be 30 seconds later (at minimum)

			// optional fields
			"body[und][0][value]" => $comment,
			"body[und][0][format]" => 'plain_text',

			"field_proposal_topic[und]" => $topic,

			// $address = 'Möllendorffstraße 6, 10367 Berlin, Deutschland';
			// $lat = '52.51577689706123';
			// $lng = '13.479752540588379';
			"field_proposal_geolocation[und][0][address][field]" => $address,
			"field_proposal_geolocation[und][0][lat]" => $lat,
			"field_proposal_geolocation[und][0][lng]" => $lng,

			"files[field_proposal_image_und_0]" => '', // filename='foo.jpg' Content-Type: 'image/jpeg'
			"field_proposal_image[und][0][_weight]" => '0',
			"field_proposal_image[und][0][fid]" => '0',
			"field_proposal_image[und][0][display]" => '1',

			"field_proposal_video_embedded[und][0][video_url]" => '', // 'https://www.youtube.com/watch?v=P7_HrzV_YGA'

			"changed" => "", // 
//			"form_build_id" => "form-uRDjkKkYHl90AFzmpc2obkVmL6dyUimw693u59ojIcw",
//			"form_build_id" => "form-RSueQjPoubJJ0Bv0KZdpeT3r0w4U_-W4fgjFQGzN_0I",
//			"form_build_id" => "form-RD1ht1qvQLN8n-i5iDcnFdp-e_LGqV-gwPlPTWIUfSY",
			"field_socialshareprivacy[und][0]" => "1", // 
			"field_proposal_haushaltsjahr[und][0][value]" => "2015", // 
			"log" => "", // 
			"additional_settings__active_tab" => "edit-revision-information", // 
			"url" => "", // 
		);

		$ret = submitRequest( $services, '/einreichen');
		if( '' != checkError( $ret)) {
			echo 'Error:<br>'.checkError( $ret);
			echo $ret.'<br>';
		}
	}

	function userRegister( $firstName, $lastName, $male, $userName, $mail, $birthYear)
	{
		echo 'Register a civic budget account<br>';
		echo '<br>';

		$services = array(
			// mandatory fields
			"form_id" => "user_register_form",
			"honeypot_time" => (time() - 60), // 'honey' send a unix timestamp but the submission time must be 30 seconds later (at minimum)
			"field_profile_title[und]" => ($male === true) ? 'Herr' : 'Frau',
			"field_profile_first_name[und][0][value]" => $firstName,
			"field_profile_surname[und][0][value]" => $lastName,
			"name" => $userName,
			"mail" => $mail,
			"field_profile_date_of_birth[und][0][value][year]" => $birthYear,

			// optional fields
//			"form_build_id" => 'form-NYPM5-iE0vbn9HEZ2sweFjjTxsNpdhUyPcZiiWcFOOY',
			"field_profile_newsletter[und]" => '0', // newsletter
			"field_profile_address[und][0][value]" => '', // address: street and street number
			"field_profile_zip[und][0][value]" => '',     // address: zip code
			"field_profile_city[und][0][value]" => '',    // address: city
			"field_profile_company[und][0][value]" => '',         // company: name
			"field_profile_company_address[und][0][value]" => '', // company: address
			"field_profile_company_zip[und][0][value]" => '',     // company: zip
			"field_profile_facebook[und][0][value]" => '',   // social: facebook
			"field_profile_twitter[und][0][value]" => '',    // social: twitter
			"field_profile_googleplus[und][0][value]" => '', // social: google+
			"field_profile_homepage[und][0][value]" => '',   // social: homepage
//			"op" => 'Neues Benutzerkonto erstellen', // submit button
//			"url" => '' // hidden and empty field
		);

		echo 'honey: '.$services['honeypot_time'].'<br>';

		$ret = submitRequest( $services, '/user/register');
		if( '' != checkError( $ret)) {
			$arr = explode( '<br>', checkError( $ret));
			if( strip_tags( $arr[0]) == 'Der Name ' . $userName . ' ist leider schon vergeben.') {
				echo 'Error: The name is already registered.<br>';
				echo 'Login: '.checkLogin( $ret);
			} else if( explode( '.', strip_tags( $arr[0]) == 'Die E-Mail-Adresse ' . $mail . ' ist schon registriert.')) {
				echo 'Error: The e-mail is already registered.<br>';
			} else {
				echo 'Error:<br>'.checkError( $ret);
				echo $ret.'<br>';
			}
		}
	}

//	submit( '', 'Comment', 0, 11, '', '', '');
	userRegister( 'John', 'Doe', true, 'johndoe', 'john@doe.com', 1970);

	echo '<br>';
	echo 'done';
?>

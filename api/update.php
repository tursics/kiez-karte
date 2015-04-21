<?php
	function readFeed( $url)
	{
		$xml = simplexml_load_file( $url);
		$ret = array();

		if( !$xml) {
			return $ret;
		}

		if( !isset( $xml->channel[0]->item)) {
			return $ret;
		}

		foreach( $xml->channel[0]->item as $item) {
			$ret[] = array(
				'title'        => (string) $item->title,
				'description'  => (string) $item->description,
				'link'         => (string) $item->link,
				'date'         => date('Y-m-d', strtotime((string) $item->pubDate))
			);
		}

		return $ret;
	}

	function getFeedDate( $feed, $link)
	{
		foreach( $feed as $value) {
			if( $link == $value['link']) {
				return $value['date'];
			}
		}
		return '';
	}

	function getFeedMetadata( $link)
	{
		$contents = file_get_contents( $link);
		$ret = array();

		$posContent = strpos( $contents, 'id="content"');
		$posSidebar = strpos( $contents, 'id="sidebar_right"');
		$strContent = substr( $contents, $posContent, $posSidebar - $posContent);

		$posName = strpos( $strContent, '>', strpos( $strContent, '<h1')) + 1;

		if( false === $posName) {
			return $ret;
		}

		$strName = substr( $strContent, $posName, strpos( $strContent, '</h1>', $posName) - $posName);

		$posLicUrl = strpos( $strContent, 'href=', strpos( $strContent, 'Lizenz:')) + strlen( 'href=');
		$strLicUrl = substr( $strContent, $posLicUrl + 1, strpos( $strContent, substr( $strContent, $posLicUrl, 1), $posLicUrl + 1) - $posLicUrl - 1);

		$posLicName = strpos( $strContent, '>', $posLicUrl) + strlen( '>');
		$strLicName = trim( substr( $strContent, $posLicName, strpos( $strContent, '</a', $posLicName) - $posLicName));

		$posModified = strpos( $strContent, 'Aktualisiert:');
		if( false === $posModified) {
			$posModified = strpos( $strContent, 'Veröffentlicht:');
		}
		$posModified = strpos( $strContent, '>', strpos( $strContent, '<span', $posModified)) + 1;
		$strModified = substr( $strContent, $posModified, strpos( $strContent, '</span>', $posModified) - $posModified);

		$ret['modified'] = strtotime( $strModified);
		$ret['modDays'] = intval(( strtotime( 'now') - $ret->modified) /60 /60 /24);
		$ret['licenseName'] = $strLicName;
		$ret['licenseUrl'] = $strLicUrl;
//		$ret['vecURL'] = Array();
		$posUrl = 0;

		do {
			$posUrl = strpos( $strContent, 'node-ckan-ressource', $posUrl);
			if( false === $posUrl) {
				break;
			}
			$posUrl = strpos( $strContent, 'href="', $posUrl) + strlen( 'href="');
			$posUrl = strpos( $strContent, 'href="', $posUrl) + strlen( 'href="');
			$strUrl = substr( $strContent, $posUrl, strpos( $strContent, '"', $posUrl) - $posUrl);

//			$ret['vecURL'][] = $strUrl;
			if( strpos( $strUrl, '.csv') > 0) {
				$ret['url'] = $strUrl;
			}
		} while( true);

		return $ret;
	}

function csv_to_array($filename='', $delimiter=',')
{
//    if(!file_exists($filename) || !is_readable($filename))
//        return FALSE;

    $header = NULL;
    $data = array();
    if (($handle = fopen($filename, 'r')) !== FALSE)
    {
        while (($row = fgetcsv($handle, 1000, $delimiter)) !== FALSE)
        {
            if(!$header)
                $header = $row;
            else
                $data[] = array_combine($header, $row);
        }
        fclose($handle);
    }
    return $data;
}

	function getFeedData( $link)
	{
//		$data = file_get_contents( $link);
//		$data = explode( "\r\n", $data);
//		return $data;

//		$csv = array_map( 'str_getcsv', file( $link));
//		$csv = str_getcsv( $data, ';');
		$csv = csv_to_array( $link, ';');
		echo $csv;
		return $csv;
	}

//	$path = 'http://daten.berlin.de/datensaetze/';
//	$link = 'wochen-und-tr%C3%B6delm%C3%A4rkte';
//	$link = 'stra%C3%9Fen-und-volksfeste';
//	$link = 'pr%C3%BCfberichte-der-berliner-heimaufsicht';
	$parseInfo = array(
		'path' => 'http://daten.berlin.de/datensaetze/',
		'link' => 'pr%C3%BCfberichte-der-berliner-heimaufsicht',
		'identifier' => array(
			'street' => 'einrichtung_strasse',
			'number' => 'einrichtung_hnr',
			'district' => 'einrichtung_bezirk',
			'zip' => 'einrichtung_plz',
			'city' => 'einrichtung_ort',
		),
	);

	$feed = readFeed( $parseInfo['path'] . 'rss.xml');
	$date = getFeedDate( $feed, $parseInfo['path'] . $parseInfo['link']);
	$meta = getFeedMetadata( $parseInfo['path'] . $parseInfo['link']);
	$data = getFeedData( $meta['url']);

	$ret = array(
		'dataset' => $parseInfo['link'],
		'update' => $date,
		'path' => $parseInfo['path'].$parseInfo['link'],
		'metadata' => $meta,
	);

	echo "<html><head><meta charset='utf-8'></head><body>";
	echo json_encode( $ret);
	echo '<br><a href="'.($ret['metadata']['url']).'">'.$ret['metadata']['url'].'</a><br><br>';

	foreach( $data as $line) {
//		foreach( $line as $bit) {
//			echo $bit.'|';
//		}
		echo '<br>';
		echo count($line).'<br>';
	}
?>

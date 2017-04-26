<?php
	// -----------------------------------------------------------------------------------
	include_once 'update-1.php';
	include_once 'update-2.php';
	include_once 'update-3.php';
	include_once 'update-4.php';
	include_once 'update-5.php';
	include_once 'update-geo.php';
	// -----------------------------------------------------------------------------------
	function loadJSON( $file)
	{
		$json = file_get_contents( $file);
		return json_decode( $json, TRUE);
	}
	// -----------------------------------------------------------------------------------
	function saveJSON( $file, $data)
	{
		$fp = fopen( $file, 'w');
		fwrite( $fp, json_encode( $data));
		fclose( $fp);
	}
	// -----------------------------------------------------------------------------------
	function getUpdateList( $name)
	{
		$data = loadJSON( 'update-list.json');

		foreach( $data as $updateData) {
			if( $updateData['name'] === $name) {
				return $updateData;
			}
		}

		return null;
	}
	// -----------------------------------------------------------------------------------
/*	function csv_to_array( $filename, $delimiter)
	{
		$header = NULL;
		$columns = 0;
		$data = array();

		if(( $handle = fopen( $filename, 'r')) !== FALSE) {
			while(( $row = fgetcsv( $handle, 10000, $delimiter)) !== FALSE) {
				if( !$header) {
					$header = $row;
					$columns = count($header);
				} else {
//					echo $columns.' '.count($row).'<br>';
					$data[] = array_combine( $header, $row);
				}
			}
			fclose( $handle);
		}
		return $data;
	}*/
	// -----------------------------------------------------------------------------------
/*	function getFeedData( $link)
	{
		$csv = csv_to_array( $link, ';');

		return $csv;
	}*/
	// -----------------------------------------------------------------------------------

	$base_dir = '../tmp-bln';
//	$dataset = 'HomeInspection';
//	$dataset = 'Restrooms';
	$dataset = 'WaterQuality';
//	$dataset = 'PublicFestivals';
//	$dataset = 'JunkMarkets';

	// prepare geo reference system
	updateGeo();

	// read daten.berlin RSS read
//	update1();

	// analyse RSS feed data dates
//	update2();

	// read dataset metadata
//	update3();

	// read dataset data
//	update4();

	// convert data
//	update5();

	echo 'done';

/*
	$data = getFeedData( $meta['url']);

	foreach( $data as $line) {
		echo $line['einrichtung_name'].'<br>';
		$street = $line[$dataset['identifier']['street']].' '.$line[$dataset['identifier']['number']];
		echo $street.'<br>';
		echo '<br>';
	}*/
?>

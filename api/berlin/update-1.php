<?php
	// -----------------------------------------------------------------------------------
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
	// -----------------------------------------------------------------------------------
	function update1()
	{
		global $base_dir;

		$feed = readFeed( 'http://daten.berlin.de/datensaetze/rss.xml');

		if( !is_dir( $base_dir)) {
			mkdir( $base_dir);
		}

		saveJSON( $base_dir.'/results.json', $feed);
	}
	// -----------------------------------------------------------------------------------
?>

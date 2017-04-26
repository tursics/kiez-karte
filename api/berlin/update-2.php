<?php
	// -----------------------------------------------------------------------------------
	function getFeedDate( $feed, $link)
	{
		foreach( $feed as $value) {
			if( $link == $value['link']) {
				return $value['date'];
			}
		}
		return '';
	}
	// -----------------------------------------------------------------------------------
	function update2()
	{
		global $base_dir;
		global $dataset;

		$updateData = getUpdateList( $dataset);

		$feed = loadJSON( $base_dir.'/results.json');
		$date = getFeedDate( $feed, $updateData['path']);

		var_dump( $date);
		echo '<br><br>';
	}
	// -----------------------------------------------------------------------------------
?>

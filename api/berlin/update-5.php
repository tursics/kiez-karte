<?php
	// -----------------------------------------------------------------------------------
	function getRawData( $data, $filetype)
	{
		if( 'gjson' == $filetype) {
			$vec = array();
			foreach( $data['features'] as $features) {
				$vec[] = $features['properties']['data'];
			}
			return $vec;
		} else if( 'json' == $filetype) {
			return $data['index'];
		}
		return array();
	}
	// -----------------------------------------------------------------------------------
	function showRawData( $rawdata)
	{
		global $dataset;

		$updateData = getUpdateList( $dataset);
		echo '<a href="'.$updateData['path'].'"" target="_blank">Info-Site</a><br>';

		if( null === $updateData['dict']) {
			return;
		}

		foreach( $rawdata[0] as $key => $value) {
			if( array_key_exists( $key, $updateData['dict'])) {
				echo '<span style="background:lime;">'.$key.': '.$value.'</span><br>';
			} else if( in_array( $key, $updateData['ignore'])) {
				echo '<span style="background:orange;">'.$key.': '.$value.'</span><br>';
			} else {
			echo $key.': '.$value.'<br>';
			}
		}

		foreach( $rawdata as $data) {
//			echo $data['bsl'].': '.$data['wasserqualitaet'].'<br>';
		}
	}
	// -----------------------------------------------------------------------------------
	function convertRawData( $rawdata)
	{
		global $dataset;

		$updateData = getUpdateList( $dataset);
		$data = array();

		if( null === $updateData['dict']) {
			echo '"dict":{} not defined in update-list.json<br><br>';
			return;
		}

		foreach( $rawdata as $rawitem) {
			$item = array();
			foreach( $rawitem as $key => $value) {
				if( array_key_exists( $key, $updateData['dict'])) {
					$item[ $updateData['dict'][$key]] = $value;
				}
			}
			$data[] = $item;
		}

		return $data;
	}
	// -----------------------------------------------------------------------------------
	function update5()
	{
		global $base_dir;
		global $dataset;

		$updateData = getUpdateList( $dataset);
		$rawdata = getRawData( loadJSON( $base_dir.'/'.$updateData['name'].'-data.'.$updateData['filetype']), $updateData['filetype']);
		$data = convertRawData( $rawdata);

		saveJSON( $base_dir.'/'.$updateData['name'].'-compiled.json', $data);

		showRawData( $rawdata);
	}
	// -----------------------------------------------------------------------------------
?>

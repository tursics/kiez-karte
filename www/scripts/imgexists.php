<?php
	$ret = '0';

	if( isset( $_GET[ 'id'])) {
		$id = strtoupper( $_GET[ 'id']);
		$id = str_replace( '/', '', $id);
		$id = str_replace( '.', '', $id);

		for( $i = 2; $i < strlen( $id); $i += 3) {
			$id = substr( $id, 0, $i) . '/' . substr( $id, $i);
		}

		$path = '../../img/' . $id . '/img.jpg';
		if( file_exists( $path)) {
			$ret = '1';
		}
	}

	echo $ret;
?>

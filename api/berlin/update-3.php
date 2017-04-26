<?php
	// -----------------------------------------------------------------------------------
	function getInfoPageMetadata( $link)
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
		$ret['name'] = trim( strip_tags( $strName));

		$posLicUrl = strpos( $strContent, 'href=', strpos( $strContent, 'Lizenz:')) + strlen( 'href=');
		$strLicUrl = substr( $strContent, $posLicUrl + 1, strpos( $strContent, substr( $strContent, $posLicUrl, 1), $posLicUrl + 1) - $posLicUrl - 1);
		$ret['licenseUrl'] = trim( strip_tags( $strLicUrl));

		$posLicName = strpos( $strContent, '>', $posLicUrl) + strlen( '>');
		$strLicName = trim( substr( $strContent, $posLicName, strpos( $strContent, '</a', $posLicName) - $posLicName));
		$ret['licenseName'] = trim( strip_tags( $strLicName));

		$posModified = strpos( $strContent, 'Aktualisiert:');
		if( false === $posModified) {
			$posModified = strpos( $strContent, 'Veröffentlicht:');
		}
		$posModified = strpos( $strContent, '>', strpos( $strContent, '<span', $posModified)) + 1;
		$strModified = substr( $strContent, $posModified, strpos( $strContent, '</span>', $posModified) - $posModified);
		$date = DateTime::createFromFormat( 'd.m.Y', $strModified);
		if( false !== $date) {
			$ret['modified'] = $date->format( 'Y-m-d');
		}

		$posAttribution = strpos( $strContent, 'href=', strpos( $strContent, 'ffentlichende Stelle:')) + strlen( 'href=');
		$posAttribution = strpos( $strContent, '>', $posAttribution) + strlen( '>');
		$strAttribution = trim( substr( $strContent, $posAttribution, strpos( $strContent, '</a', $posAttribution) - $posAttribution));
		$ret['attribution'] = $strAttribution;

		$ret['ressources'] = array();
		$posUrl = 0;

		do {
			$posUrl = strpos( $strContent, 'node-ckan-ressource', $posUrl);
			if( false === $posUrl) {
				break;
			}
			$posUrl = strpos( $strContent, 'href="', $posUrl) + strlen( 'href="');
			$posUrl = strpos( $strContent, 'href="', $posUrl) + strlen( 'href="');
			$strUrl = substr( $strContent, $posUrl, strpos( $strContent, '"', $posUrl) - $posUrl);

			$ret['ressources'][] = $strUrl;
		} while( true);

		return $ret;
	}
	// -----------------------------------------------------------------------------------
	function update3()
	{
		global $base_dir;
		global $dataset;

		$updateData = getUpdateList( $dataset);

		$metadata = getInfoPageMetadata( $updateData['path']);

		saveJSON( $base_dir.'/'.$updateData['name'].'-metadata.json', $metadata);
	}
	// -----------------------------------------------------------------------------------
?>

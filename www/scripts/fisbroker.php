<?php
	$ret = array();

	if( !isset( $_GET[ 'type'])) {
		$ret[ error] = "Parameter 'type' missing.";
	} else {
		if( !isset( $_GET[ 'name'])) {
			$ret[ error] = "Parameter 'name' missing.";
		} else {
			$type = $_GET[ 'type'];
			$name = $_GET[ 'name'];

			$dataURL = '';
			if( 'WFS' == $type) {
				$dataURL = 'http://fbinter.stadt-berlin.de/fb/wfs/geometry/senstadt/' . $name;
			} else if( 'WMS' == $type) {
				$dataURL = 'http://fbinter.stadt-berlin.de/fb/wms/senstadt/' . $name;
			} else if( 'FEED' == $type) {
				$dataURL = 'http://fbinter.stadt-berlin.de/fb/feed/senstadt/' . $name;
			} else {
				$ret[ error] = "Wrong parameter 'type'.";
			}
			$ret[ url] = $dataURL;

			if( '' != $dataURL) {
				// get capabilities
				$addons = '?SERVICE=' . $type . '&VERSION=1.1.0&REQUEST=GetCapabilities';

				$content = file_get_contents( $dataURL . $addons);
				$content = str_replace( 'ogc:', 'ogc_', $content);
				$content = str_replace( 'ows:', 'ows_', $content);
				$content = str_replace( 'wfs:', 'wfs_', $content);

				$obj = simplexml_load_string( $content);

				$ret[ title] = trim( $obj->ows_ServiceIdentification->ows_Title);
				$ret[ fees] = trim( $obj->ows_ServiceIdentification->ows_Fees);
				$ret[ provider] = trim( $obj->ows_ServiceProvider->ows_ProviderName);
				$ret[ wfs] = trim( $obj->wfs_FeatureTypeList->wfs_FeatureType->wfs_Name);

//				$ows_Value = '';
//				foreach( $obj->ows_OperationsMetadata->ows_Parameter->ows_Value as $value) {
//					$ows_Value .= $value . ',';
//				}
//				$ret[ ows] = trim( $ows_Value, ',');

				// describe feature type
				$addons = '?SERVICE=' . $type . '&VERSION=1.1.0&REQUEST=DescribeFeatureType&TYPENAME=' . $ret[ wfs];

				// get feature
				$addons = '?SERVICE=' . $type . '&VERSION=1.1.0&REQUEST=GetFeature&TYPENAME=' . $ret[ wfs];

				$content = file_get_contents( $dataURL . $addons);
				$content = str_replace( 'gml:', 'gml_', $content);
				$content = str_replace( 'fis:', 'fis_', $content);
				$content = str_replace( 'wfs:', 'wfs_', $content);

				$obj = simplexml_load_string( $content);

				$ret[ obj] = $obj;
			}
		}
	}

	echo json_encode( $ret);
?>

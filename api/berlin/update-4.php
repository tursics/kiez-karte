<?php
	// -----------------------------------------------------------------------------------
	// -----------------------------------------------------------------------------------
	function update4()
	{
		global $base_dir;
		global $dataset;

		$updateData = getUpdateList( $dataset);

		$metadata = loadJSON( $base_dir.'/'.$updateData['name'].'-metadata.json');

		if( null !== $metadata['ressources']) {
			foreach( $metadata['ressources'] as $resource) {
				if( false !== strpos( $resource, '.'.$updateData['filetype'])) {
					$data = loadJSON( $resource);
					saveJSON( $base_dir.'/'.$updateData['name'].'-data.'.$updateData['filetype'], $data);
					return;
				}
			}

			foreach( $metadata['ressources'] as $resource) {
				echo $resource.'<br>';
			}
		}
	}
	// -----------------------------------------------------------------------------------
?>

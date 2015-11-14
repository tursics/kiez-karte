<?php

// http://www.stromnetz-berlin.de/de/anlagen-in-berlin.htm
// SMeterEngineWebServices_v08.pdf

/*$xml_str = '<smeterengine>'.
'<scale>DAY</scale>'.
'<city>BERLIN</city>'.
'<district>'.
'<time_period begin="2013-06-12 15:40:00" end="2013-06-12 17:00:00" time_zone="CET"/>'.
'</district>'.
'</smeterengine>';

$url = 'https://www.vattenfall.de/SmeterEngine/networkcontrol';*/

//$xml_str = '<smeterengine start="2013-06-12T09:00:00" end="2013-06-12T11:00:00">'.
/*$xml_str = '<smeterengine start="2015-07-31T00:00:00" end="2015-07-31T23:00:00">'.
'<cities>'.
'<city>BERLIN</city>'.
'<latitude>52.30</latitude>'.
'<longitude>13.25</longitude>'.
'</cities>'.
'</smeterengine>';

$url = 'https://www.vattenfall.de/SmeterEngine/energyProjection';*/

$xml_str = '<smeterengine><scale>DAY</scale><city>BERLIN</city><district name="Marzahn-Hellersdorf">'.
'<time_period begin="2015-11-13 00:00:00" end="2015-11-14 00:00:00" '.
'time_zone="CET"/></district></smeterengine>';

$url = 'https://www.vattenfall.de/SmeterEngine/networkcontrolmobile';

//	echo(htmlspecialchars($url) . '<br><br>');
//	echo(htmlspecialchars($xml_str) . '<br><br>');

			$ch = curl_init($url);
//			curl_setopt($ch, CURLOPT_MUTE, 1);
			curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
			curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
			curl_setopt($ch, CURLOPT_POST, 1);
			curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: text/xml'));
			curl_setopt($ch, CURLOPT_POSTFIELDS, "$xml_str");
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			$output = curl_exec($ch);
			curl_close($ch);

echo $output;
/*
$xml = new SimpleXMLElement($output);
//   $xml = simplexml_load_file("artikel.xml"');

	echo('<br><br>');
	echo($xml->energyProjectionCityData->district[0]);
//	var_dump($xml->energyProjectionCityData->energyProjectionDistrictData->district);
	foreach( $xml->energyProjectionCityData->energyProjectionTimeData as $timeData) {
//$output = replaceXML( $output, 'energyProjectionTimeData', '<div style="padding:0 0 0 1em;margin:0 0 0.2em 0;border-top:1px solid black;border-bottom:1px solid black;">', '</div>');
		echo( 'Date: '.$timeData->date .'<br>');
		echo( 'Solar: '.$timeData->solarProjection .'<br>');
		echo( 'Solar foreacast: '.$timeData->solarProjectionForeacast .'<br>');
		echo( 'Wind: '.$timeData->windProjection .'<br>');
		echo( 'Wind foreacast: '.$timeData->windProjectionForeacast .'<br>');
		echo( 'Rest projection: '.$timeData->restProjection .'<br>');
	}
	echo('<br><br>');

//	var_dump($xml);

	echo('<br><br>');

$output = htmlspecialchars($output);

$output = replaceXML( $output, 'energyProjectionDistrictData', '<div style="padding:1em 0 1em 0;">', '</div>');
$output = replaceXML( $output, 'district', '<h3 style="margin:0;">', '</h3>');

$output = replaceXML( $output, 'energyProjectionTimeData', '<div style="padding:0 0 0 1em;margin:0 0 0.2em 0;border-top:1px solid black;border-bottom:1px solid black;">', '</div>');
$output = replaceXML( $output, 'date', 'Date: ', '<br>');
$output = replaceXMLColored( $output, 'solarProjection', 'Solar: ', '<br>');
$output = replaceXMLColored( $output, 'solarProjectionForeacast', 'Solar foreacast: ', '<br>');
$output = replaceXMLColored( $output, 'windProjection', 'Wind: ', '<br>');
$output = replaceXMLColored( $output, 'windProjectionForeacast', 'Wind foreacast: ', '<br>');
$output = replaceXML( $output, 'restProjection', 'Rest projection: ', '<br>');

$output = replaceXML( $output, 'astronomicData', '<div style="padding:1em 0 1em 0;background:#ccccff;">', '</div>');
$output = replaceXML( $output, 'day', 'Day: ', '<br>');
$output = replaceXML( $output, 'sunrise', 'Sunrise: ', '<br>');
$output = replaceXML( $output, 'sundown', 'Sundown: ', '<br>');

			echo($output);

function replaceXML( $string, $tag, $leftText, $rightText)
{
	return str_replace("&lt;$tag&gt;", $leftText, str_replace("&lt;/$tag&gt;", $rightText, $string));
}

function replaceXMLColored( $string, $tag, $leftText, $rightText)
{
	return str_replace("&lt;$tag&gt;", $leftText, str_replace("&lt;/$tag&gt;", $rightText, $string));
}
*/
?>

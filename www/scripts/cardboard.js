// http://www.sitepoint.com/bringing-vr-to-web-google-cardboard-three-js/
var map = null;
var data = [
//{title: 'Reichstag', consumption: '0', gml: '3890_5819'},
//{title: 'Bundeskanzerinamt', consumption: '0', gml: '3890_5820'},
//{title: 'Fernsehturm (Darstellungsprobleme)', consumption: '0', gml: '3920_5820'},
{title: 'Gesamt Berlin', consumption: '2.309', gml: '3920_5819'},
{title: 'Charlottenburg-Wilmersdorf', consumption: '298', gml: '3850_5819'},
{title: 'Friedrichshain-Kreuzberg', consumption: '172', gml: '3950_5819'},
{title: 'Lichtenberg', consumption: '167', gml: '3960_5819'},
{title: 'Marzahn-Hellersdorf', consumption: '100', gml: '4050_5821'},
{title: 'Mitte', consumption: '413', gml: '3870_5820'},
{title: 'Neukölln', consumption: '131', gml: '3930_5815'},
{title: 'Pankow', consumption: '195', gml: '3910_5825'},
{title: 'Reinickendorf', consumption: '168', gml: '3860_5827'},
{title: 'Spandau', consumption: '147', gml: '3770_5822'},
{title: 'Steglitz-Zehlendorf', consumption: '196', gml: '3810_5810'},
{title: 'Treptow-Köpenick', consumption: '147', gml: '4030_5811'},
{title: 'Tempelhof-Schöneberg', consumption: '236', gml: ''},
];

var id = 0;
var timer = null;

// -----------------------------------------------------------------------------

$( document).on( "pagecreate", "#pageMap", function()
{
$( '#info').bind('click', function(){
	++id;
	onShow3D();
});
	onShow3D();
});

// -----------------------------------------------------------------------------

$( document).on( "pageshow", "#pageMap", function()
{
});

// -----------------------------------------------------------------------------

function onShow3D()
{
	if( id >= data.length){
		id = 0;
	}
	if( null != timer) {
		clearInterval( timer);
	}

	var str = '';
	str += '<div style="position:absolute;right:0;bottom:0;padding:1em;line-height:1.5em;background:rgba(255,255,255,.75);font-size:2em;text-align:center;font-family:Montserrat, sans-serif;">';
	str += 'Stromverbrauch<br>' + data[id].title + '<br>Gestern<br>' + data[id].consumption + ' Megawatt</div>';
	$( '#info').html( str);
	$( '#info').css( 'display', 'block');

	str = '';
	str += '<div id="scene3d" style="width:900px;height:800px;padding:0 !important;margin:0;"></div>';
	$( '#mapSelectItem').html( str);
	$( '#mapSelectItem').css( 'display', 'block');

	Proj4js.defs["EPSG:25833"]='+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs';

	$.ajax({
		type: "GET",
		url: '../data3d/' + data[id].gml + '.gml',
		dataType: "xml",
		success: function(response) {
			var cityGML = new CityGL.CityGML(response, "http://kiez-karte.berlin/images3d/", {});
			var object3ds = cityGML.Read(0.1);
			var extent = cityGML.ParseExtent(cityGML.doc);
			var ll = new CityGL.Point(extent.lowerCorner[0],extent.lowerCorner[1],extent.lowerCorner[2]);
			var ur = new CityGL.Point(extent.upperCorner[0],extent.upperCorner[1],extent.upperCorner[2]);
			ll.x -= 1*(ur.x-ll.x);
			ll.y -= 1*(ur.y-ll.y);
			ur.x += 1*(ur.x-ll.x);
			ur.y += 1*(ur.y-ll.y);
			var boundingBox = new CityGL.BoundingBox(ll,ur);
			var viewport = new CityGL.ViewPort("scene3d", boundingBox, {EPSG: 'EPSG:25833'});
			var geomlayer = new CityGL.GeometryLayer({name: 'Berlin', EPSG:'EPSG:25833'});		
			var osm = new CityGL.OpenStreetMap({name: "OSM", });
			geomlayer.addObject3Ds(object3ds);
			viewport.AddLayer(osm);
			viewport.AddLayer(geomlayer);
			viewport.StartAnimating();
effect = new THREE.StereoEffect( viewport.renderer);

			var ll = new CityGL.Point(extent.lowerCorner[0],extent.lowerCorner[1],extent.lowerCorner[2]);
			var ur = new CityGL.Point(extent.upperCorner[0],extent.upperCorner[1],extent.upperCorner[2]);

			var position = new CityGL.Point(ur.x,ll.y+(ll.y-ur.y)/1,ur.z+(ur.z-ll.z)/2);
			var lookat= new CityGL.Point(ur.x+(ll.x-ur.x)/2,ur.y+(ll.y-ur.y)/2,ur.z+(ll.z-ur.z)/2);
			viewport.MoveTo(position, lookat);

			timer = setInterval(timerFunc, 100);
			var angle = 0;
			var step = (2*Math.PI) / 90;
			function timerFunc() {
				angle += step;
				if( angle >= 360) {
					angle = 0;
				}

//angle=315;
				var xradius = (ll.x-ur.x)/2;
				var yradius = (ll.y-ur.y)/2;
				var zradius = (ll.z-ur.z)/2;
				var x = ur.x+xradius;
				var y = ur.y+yradius;
				var z = ur.z+zradius;
				xradius = yradius = Math.min(xradius,yradius);

				position = new CityGL.Point(x+2.35*xradius*Math.sin(angle),y+2.35*yradius*Math.cos(angle),z-2*zradius);
				lookat= new CityGL.Point(x,y,z);
				viewport.MoveTo(position, lookat);
			}

function setOrientationControls(e) {
    if (!e.alpha) {
      return;
    }
controls = new THREE.DeviceOrientationControls(viewport, true);
  controls.connect();
  controls.update();
}
//window.addEventListener('deviceorientation', setOrientationControls, true);

//element.addEventListener('click', fullscreen, false);

		}
	});
}

// -----------------------------------------------------------------------------

var gm = require('googlemaps');

var mpg = 30;
var totalGallons = 12;
var gasPriceHere = 3.65;
var totalMiles = mpg * totalGallons;

//	This is the current location of UNC Chapel Hill
lat = 35.7748760;
lon = -78.9514510;

getDestination(lat, lon, 90, 10, function(point){
	console.log(point);
});

//	Gets you a point some distance away (km) in the bearing that you desire (deg)
function getDestination(lat, lon, brng, dist, callback){
	dist = dist / 6371;
	brng = toRad(brng);
	var lat1 = toRad(lat), lon1 = toRad(lon);

   var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) + 
                        Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));

   var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) *
                                Math.cos(lat1), 
                                Math.cos(dist) - Math.sin(lat1) *
                                Math.sin(lat2));
   if (isNaN(lat2) || isNaN(lon2)) return null;
   lat2 = toDeg(lat2);
   lon2 = toDeg(lon2);
	gm.reverseGeocode(gm.checkAndConvertPoint([lat2, lon2]), function(err, data){
  		callback(JSON.stringify(data));
	});
};

function toRad(deg) {
   return deg * Math.PI / 180;
}

function toDeg(rad) {
   return rad * 180 / Math.PI;
}
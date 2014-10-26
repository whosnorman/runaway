var gm = require('googlemaps');

var totalRemaining = 50 * .3; // Dollars remaining
var mpg = 30; // Miles per gallon
var totalGallons = 12; // Gallons per tank
var gasPriceHere = 3.65; // Gas price in NC

//	This is the current location of UNC Chapel Hill
lat = 35.7748760;
lon = -78.9514510;

var totalMiles = (totalRemaining / (totalGallons * gasPriceHere)) * (mpg * totalGallons);

var totalLocations = 8;

var locationsArray = [];

console.log("$" + totalRemaining + 
	" on a " + mpg + "mpg car and " + totalGallons
	 + " gallon tank can get you " + totalMiles + " miles.");

for (var i = 0; i < totalLocations; i++) {
    getDestination(lat, lon, 360 * i / totalLocations, totalMiles, handleResult);
};

function handleResult(result, lat, lon, brng, dist) {
    //	If there is no point at this location, then change the bearing a little bit and try again
    if (result == null || result.length == 0) {
    	brng = Math.floor(brng + 10);
    	console.log("Couldn't find a spot, retrying " + dist + "miles at " + brng + " degrees");
        getDestination(lat, lon, brng, dist, handleResult);
    }
    //	If there is a point here, add it to the list of points you can visit.
    else {
        locationsArray.push(result[0].formatted_address);
    }

    if (locationsArray.length == totalLocations) {
        console.log(locationsArray);
    }
}

//	Gets you a point some distance away (miles) in the bearing that you desire (deg)
function getDestination(lat, lon, brng, miles, callback) {
	dist = miles * 1.60934;
    dist = dist / 6371;
    brng = toRad(brng);
    //console.log("lat: " + lat + "lon:" + lon);
    var lat1 = toRad(lat),
        lon1 = toRad(lon);

    var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) +
        Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));

    var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) *
        Math.cos(lat1),
        Math.cos(dist) - Math.sin(lat1) *
        Math.sin(lat2));
    if (isNaN(lat2) || isNaN(lon2)) return null;
    lat2 = toDeg(lat2);
    lon2 = toDeg(lon2);
    //console.log(lat2 + ", " + lon2);
    gm.reverseGeocode(gm.checkAndConvertPoint([lat2, lon2]), function(err, data) {
        callback(data.results, toDeg(lat) % 360, toDeg(lon) % 360, toDeg(brng), dist * 6371);
    });
};

function toRad(deg) {
    return deg * Math.PI / 180;
}

function toDeg(rad) {
    return rad * 180 / Math.PI;
}
var express = require('express');
var app = express();
var http = require('http');
var server = http.Server(app);
var request = require('request');
var logfmt = require('logfmt');
var bodyParser = require('body-parser');
var router = express.Router();

var gm = require('googlemaps');


app.use(logfmt.requestLogger());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

// middleware
router.use(function(req, res, next) {
	console.log('happening');
	next();
});


router.get('/', function(req, res) {
	res.json({ message: 'hello world' });
});

// all routes that end in /route
router.route('/route')
	.post(function(req, res) {
		var body = req.body;
		var lat = body.lat;
		var lon = body.lon;
		var budget = body.budget;
		var hours = body.hours;

		console.log(lat + ' ' + lon + ' ' + hours);

		res.json({ message: 'post request to route recieved' });
	})

	.get(function(req, res) {
		var body = req.body;
		console.log(body);

		res.json({ message: 'get request to route recieved' });
	});



// all routes are prefixed with /api
app.use('/api', router);


var port = Number(process.env.PORT || 3000);

// start up the server
server.listen(port, function() {
	console.log("listening on " + port);
});



var mpg = 30;
var totalGallons = 12;
var gasPriceHere = 3.65;
var totalMiles = mpg * totalGallons;

//	This is the current location of UNC Chapel Hill
lat = 35.7748760;
lon = -78.9514510;

/* getDestination(lat, lon, 90, 10, function(point){
	console.log(point);
});
*/

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

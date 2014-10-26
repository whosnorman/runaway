var express = require('express');
var app = express();
var http = require('http');
var server = http.Server(app);
var request = require('request');
var logfmt = require('logfmt');
var bodyParser = require('body-parser');
var router = express.Router();

var gm = require('googlemaps');
var distance = require('google-distance');


var mpg = 30; // Miles per gallon
var totalGallons = 12; // Gallons per tank
var gasPriceHere = 3.65; // Gas price in NC
var totalLocations = 8;

var done = false;
//  This is the current location of UNC Chapel Hill
//lat = 35.7748760;
//lon = -78.9514510;


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
    res.json({
        message: 'hello world'
    });
    res.end();
});

// all routes that end in /route
router.route('/route')
    .post(function(req, res) {
        var body = req.body;
        var lat = body.lat;
        var lon = body.lon;
        var budget = body.budget;
        var hours = body.hours;
        done = false;
        console.log(lat + ' ' + lon + ' ' + hours);
        myLocation = [lat, lon];
        radialPoints(lat, lon, budget, hours, function(pointsList) {
            if (!done) {
                done = true;
                res.json({
                    message: 'post request to route recieved',
                    points: pointsList
                });
            }
        });
    })

.get(function(req, res) {
    var body = req.body;
    res.json({
        message: 'get request to route recieved'
    });
    res.end();
});



// all routes are prefixed with /api
app.use('/api', router);


var port = Number(process.env.PORT || 3000);

// start up the server
server.listen(port, function() {
    console.log("listening on " + port);
});


//////////////////////////////////ALGORITHMZ/////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

var locationsArray = [];
var totalRetries = 0;
var myLocation = [];

function radialPoints(lat, lon, budget, hours, finalCallback) {



    var gasMoneyOneWay = budget * .3; // Dollars remaining
    var totalMiles = (gasMoneyOneWay / (totalGallons * gasPriceHere)) * (mpg * totalGallons);
    locationsArray = [];
    console.log("$" + gasMoneyOneWay +
        " on a " + mpg + "mpg car and " + totalGallons + " gallon tank can get you " + totalMiles + " miles. Hours = " + hours + ".");

    for (var i = 0; i < totalLocations; i++) {
        getDestination(lat, lon, 360 * i / totalLocations, .8 * totalMiles, hours, handleResult, finalCallback);
    };
}

function handleResult(result, lat, lon, brng, dist, duration, finalCallback) {
    //	If there is no point at this location, then change the bearing a little bit and try again
    if (result == null) {
        brng = Math.floor(brng + 10);
        console.log("Couldn't find a spot, retry " + totalRetries + " and " + dist + "miles at " + brng + " degrees");
        totalRetries++;
        if (totalRetries > 5) {
            console.log("Done!");
            finalCallback(locationsArray);
        } else {
            getDestination(lat, lon, brng, dist, duration, handleResult, finalCallback);
        }
    }
    //	If there is a point here, add it to the list of points you can visit.
    else {
        locationsArray.push(result);
        console.log("PUSH!");
        totalRetries = 0;
    }

    if (locationsArray.length >= totalLocations) {
        console.log("DONE!");
        finalCallback(locationsArray);
    }
}

//	Gets you a point some distance away (miles) in the bearing that you desire (deg)
function getDestination(lat, lon, brng, miles, duration, callback, finalCallback) {
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
    console.log(lat2 + ", " + lon2);
    /*gm.reverseGeocode(gm.checkAndConvertPoint([lat2, lon2]), function(err, data) {
        callback(data.results, toDeg(lat) % 360, toDeg(lon) % 360, toDeg(brng), dist * 6371 / 1.60934, finalCallback);
    });*/
    distance.get({
            origin: myLocation[0] + "," + myLocation[1],
            destination: lat2 + "," + lon2
        },
        function(err, data) {
            //if (err) return console.log("Error in getting distance:" + err);
            //console.log(data);
            if (!err) {
                if (data.durationValue > duration * 60 * 60) {
                    console.log("Time " + data.durationValue / 3600 + " is longer than " + duration + ". Retrying with distance " + miles + " and angle " + toDeg(brng));
                    return getDestination(lat, lon, toDeg(brng), .7 * miles, duration, callback, finalCallback);
                } else {
                    console.log("Time = " + data.durationValue / 3600);
                    callback({
                        lat: lat2,
                        lon: lon2,
                        hours: Math.floor(data.durationValue / 3600),
                        mins: data.durationValue % 60,
                        cost: ((data.distanceValue * 0.000621371) / 30) * gasPriceHere,
                        gasTanks: (((data.distanceValue * 0.000621371) / 30)) / totalGallons
                    }, lat, lon, toDeg(brng), dist * 6371 / 1.60934, duration, finalCallback);
                }
            } else {
                callback(null, lat, lon, toDeg(brng), dist * 6371 / 1.60934, duration, finalCallback);
            }
        });
};

function toRad(deg) {
    return deg * Math.PI / 180;
}

function toDeg(rad) {
    return rad * 180 / Math.PI;
}
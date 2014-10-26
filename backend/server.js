var express = require('express');
var app = express();
var http = require('http');
var server = http.Server(app);
var request = require('request');
var logfmt = require('logfmt');
var bodyParser = require('body-parser');
var router = express.Router();



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

		console.log(body);

		res.send('post request to route recieved');
	})

	.get(function(req, res) {
		var body = req.body;
		console.log(body);

		res.send('get request to route recieved');
	});



// all routes are prefixed with /api
app.use('/api', router);


var port = Number(process.env.PORT || 3000);

// start up the server
server.listen(port, function() {
	console.log("listening on " + port);
});
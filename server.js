// BASE SETUP
// ======================================

// CALL THE PACKAGES --------------------
var config = require('./config');
var express    = require('express');		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser'); 	// get body-parser
var morgan     = require('morgan'); 		// used to see requests
var mongoose   = require('mongoose');
var User       = require('./app/models/user');
var port       = process.env.PORT || 8080; // set the port for our app
var jwt 	   = require('jsonwebtoken');
var path = require('path');




// APP CONFIGURATION ---------------------
// use body parser so we can grab information from POST requests

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




// configure our app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

// log all requests to the console 
app.use(morgan('dev'));

// connect to our database (hosted on mongolab)

mongoose.connect(config.database);

// set static files location
// used for requests that our frontend will make

app.use(express.static(__dirname + "/public"));


// API ROUTES ------------------------
var apiRoutes = require('./app/routes/api')(app, express); 
app.use('/api', apiRoutes);


// Main Catchall Route
// Send users to the front end
//has to be registered after api routes


app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
	});




// START THE SERVER
// =============================================================================
app.listen(config.port);
console.log('Magic happens on port ' + config.port);
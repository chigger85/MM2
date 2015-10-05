var User = require('../models/user');
var Fixture = require('../models/fixture')
var Goal = require('../models/goal')
var jwt = require('jsonwebtoken');
var config = require('../../config');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {

	// get an instance of the express router
	var apiRouter = express.Router();

	//route for authenticating users (POST http://localhost:8080/api/authenticate)

		// on routes that end in /users
	// ----------------------------------------------------
	apiRouter.route('/users')

		// create a user (accessed at POST http://localhost:8080/users)
		.post(function(req, res) {
			
			var user = new User();		// create a new instance of the User model
			user.firstname = req.body.firstname;  // set the users name (comes from the request)
			user.secondname = req.body.secondname;  // set the users username (comes from the request)
			user.username = req.body.username;  // set the users password (comes from the request)
			user.password = req.body.password;
			user.dob = req.body.dob;
			user.position1 = req.body.position1;
			user.position2 = req.body.position2;
			user.address = req.body.address;
			user.email = req.body.email;
			user.mob = req.body.mob;  
			user.userType = req.body.userType;

			user.save(function(err) {
				//if (err) return res.send(err);
				if (err) {
					// duplicate entry
					if (err.code == 11000) 
						return res.json({ success: false, message: 'A user with that username already exists. '});
					else 
						return res.send(err);
					}
	 
	 			// return a message
	 			res.json({ message: 'User created!' });

			});

		})


	apiRouter.post('/authenticate', function(req, res) {

			// find the user
			// select the name username and password explicitly
			User.findOne({
				username: req.body.username
			   }).select('firstname username password _id userType').exec(function(err, user) {

			   	if (err) throw err;

			   	// no user with that username was found
				if (!user) { 
				  res.json({

					success: false,
					message: 'Authentication failed. User not found.'

				});
			} else if (user) {

				//check if pasword matches

				var validPassword = user.comparePassword(req.body.password);
				if (!validPassword) {

					res.json({

						sucess: false,
						message: "Authentication failed.Wrong password."
					});
				} else {

				 	// user found and correct password create a token

				 	 var token = jwt.sign({

				 	 	userType: user.userType,
				 	 	username: user.username,
				 	 	id: user._id,
				 	 	

				 	 

				 	 	

				 	 }, superSecret, {

				 	 	expiresInMinutes: 1440 // expires in 24 hrs
				 	 });

				 	 // return the information including token as JSON
					res.json({
					success: true,
					message: 'Enjoy your token!', 
					token: token
				  })
				}
		   	}

		});

	});


	// middleware to use for all requests
	apiRouter.use(function(req, res, next) {


		//check  header or url parameters or post parameters for token

		var token = req.body.token || req.query.token || req.headers['x-access-token'];

		//deconde token

		if (token) {

			//verifies secret and checks exp

			jwt.verify(token, superSecret, function(err, decoded) {

				if (err) {

					return res.status(403).send({

						success: false,
						message: "Failed to authenticate token."
					});
				} else {
					// if everything is good, save to request for use in other routes
				  req.decoded = decoded;

				  next();

				}
			});

		} else {
			// if there is no token
			// return an HTTP response of 403 (access forbidden) and an error message return res.status(403).send({
			return res.status(403).send({
				success: false,
	  			message: 'No token provided.'
			});
		}

		// do logging
		console.log('Somebody just came to our app!');
		 // make sure we go to the next routes and don't stop here
	});



	// test route to make sure everything is working 
	// accessed at GET http://localhost:8080/api
	apiRouter.get('/', function(req, res) {
		res.json({ message: 'hooray! welcome to our api!' });	
	});



	apiRouter.route('/users')

		// get all the users (accessed at GET http://localhost:8080/api/users)
		.get(function(req, res) {
			User.find(function(err, users) {
				if (err) return res.send(err);

				// return the users
				res.json(users);
			});
		});

	// on routes that end in /users/:user_id
	// ----------------------------------------------------
	apiRouter.route('/users/:user_id')

		// get the user with that id
		.get(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {
				if (err) return res.send(err);

				// return that user
				res.json(user);
			});
		})

		// update the user with this id
		.put(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {

				if (err) return res.send(err);

				// set the new user information if it exists in the request
				if (req.body.firstname) user.firstname = req.body.firstname;
				if (req.body.secondname) user.secondname = req.body.secondname;
				if (req.body.username) user.username = req.body.username;
				if (req.body.password) user.password = req.body.password;
				if (req.body.dob) user.dob = req.body.dob;
				if (req.body.position1) user.position1 = req.body.position1;
				if (req.body.position2) user.position2 = req.body.position2;
				if (req.body.address) user.address = req.body.address;
				if (req.body.email) user.email = req.body.email;
				if (req.body.mob) user.mob = req.body.mob;  
				if (req.body.userType) user.userType = req.body.userType;  

				// save the user
				user.save(function(err) {
					if (err) return res.send(err);

					// return a message
					res.json({ message: 'User updated!' });
				});

			});
		})

		// delete the user with this id
		.delete(function(req, res) {
			User.remove({
				_id: req.params.user_id
			}, function(err, user) {
				if (err) return res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});


		// api endpoint to get user information
	apiRouter.get('/me', function(req, res) {
		res.send(req.decoded);
		console.log(req.decoded);
		my_id = req.decoded.id;
		console.log(req.decoded.userType)
		


	});

	

	





// -------------------------- fixture api calls -------------------------



	apiRouter.route('/fixtures')

	// get all the fixtures (accessed at GET http://localhost:8080/api/fixtures)

		.get(function(req, res) {
			Fixture.find(function(err, fixtures) {
				if (err) return res.send(err);

				// return the users
				res.json(fixtures);
			});
		})



		// create a user (accessed at POST http://localhost:8080/fixtures)
		.post(function(req, res) {
			
			var fixture = new Fixture();	
			fixture.opposition = req.body.opposition; 
			fixture.date = req.body.date; 
			fixture.home = req.body.home;
			fixture.venue = req.body.venue; 
			fixture.date = req.body.date;  
			fixture.ko = req.body.ko;	
			fixture.comp = req.body.comp;
			fixture.available = req.body.available; //available is an array of player ids
			fixture.paid = req.body.paid; // list of player ids who paid
			fixture.matchStats.homeGoals = req.body.homeGoals;
			fixture.matchStats.awayGoals = req.body.awayGoals;
			fixture.matchStats.goal= req.body.goal;
			fixture.matchStats.yellow = req.body.yellow;
			fixture.matchStats.red = req.body.red;
			fixture.matchStats.motm = req.body.motm;
			fixture.matchStats.starter = req.body.starter;
			fixture.matchStats.subs = req.body.subs;

			fixture.save(function(err) {
				//if (err) return res.send(err);
				if (err) {
					// duplicate entry
					if (err.code == 11000) 
						return res.json({ success: false, message: 'A fixture with that date already exists. '});
					else 
						return res.send(err);
					}
	 
	 			// return a message
	 			res.json({ message: 'fixture created!' });

		

			});

		});


	apiRouter.route('/fixtures/:fixture_id')
	


		// delete the fixture with this id
		.delete(function(req, res) {
			Fixture.remove({
				_id: req.params.fixture_id
			}, function(err, fixture) {
				if (err) return res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		})



		// get the fixture with that id
		.get(function(req, res) {
			Fixture.findById(req.params.fixture_id, function(err, fixture) {
				if (err) return res.send(err);

				// return that fixture
				res.json(fixture);
			});
		})

		.put(function(req, res) {

			Fixture.findById(req.params.fixture_id, function(err, fixture) {

				if (err) return res.send(err);

				// set the new user information if it exists in the request
				if (req.body.opposition) fixture.opposition = req.body.opposition;
				if (req.body.venue) fixture.venue = req.body.venue
				if (req.body.date) fixture.date = req.body.date;
				if (req.body.home) fixture.home = req.body.home;
				if (req.body.ko) fixture.ko = req.body.ko;
				if (req.body.available) fixture.available = req.body.available;
				if (req.body.comp) fixture.comp = req.body.comp;
				if (req.body.paid) fixture.paid = req.body.paid;
				if (req.body.homeGoals) fixture.matchStats.homeGoals = req.body.homeGoals;
				if (req.body.awayGoals) fixture.matchStats.awayGoals = req.body.awayGoals;
				if (req.body.homeGoals) fixture.matchStats.homeGoals = req.body.homeGoals;
				if (req.body.goal) fixture.matchStats.goal = req.body.goal;
				if (req.body.yellow) fixture.matchStats.yellow = req.body.yellow;
				if (req.body.red) fixture.matchStats.red = req.body.red;
				if (req.body.motm) fixture.matchStats.motm = req.body.motm;
				if (req.body.starter) fixture.matchStats.starter = req.body.starter;
				if (req.body.subs) fixture.matchStats.subs = req.body.subs;
				
				// save the fixture
				fixture.save(function(err) {
					if (err) return res.send(err);

					// return a message
					res.json({ message: 'Fixture updated!' });
				});

			});
		});



	
	apiRouter.route('/fixtures/:fixture_id/availability')



	// get the availibility for fixture with that id
		.get(function(req, res) {
			Fixture.findById(req.params.fixture_id, function(err, fixture) {
				if (err) return res.send(err);

				// return that fixture
				res.json(fixture.available);
			});
		})




	apiRouter.route('/fixtures/:fixture_id/yes')

		//add availability to the fixture


		.put(function(req, res) {

			Fixture.findByIdAndUpdate(req.params.fixture_id, {$push: {"available": my_id}},  function(err, fixture) {
				if (err) return res.send(err);

				// return that fixture
				res.json({message: "You are available"});
				

			});
		});



	apiRouter.route('/fixtures/:fixture_id/no')

		//remove availability of fixture

		.put(function(req, res) {

			Fixture.findByIdAndUpdate(req.params.fixture_id, {$pull: {"available": my_id}},  function(err, fixture) {
				if (err) return res.send(err);

				// return that fixture
				res.json({message: "You are not available"});
				
			});
		});








	

// -----------------Goal API calls ---------------------
	

	apiRouter.route('/goals')


	// create a goal (accessed at POST http://localhost:8080/goals)
		.post(function(req, res) {
			var goal = new Goal();
			goal.scorer = req.body.scorer;
			goal.mins = req.body.mins;
			goal.assist = req.body.assist;
			goal.fixture = req.body.fixture;

			goal.save(function(err) {
				//if (err) return res.send(err);
				if (err) {

						return res.send(err);
					}
	 
	 			// return a message
	 			res.json({ message: 'Goal Saved' });

		

			});


		})


	// get all the goals (accessed at GET http://localhost:8080/api/goals)

		.get(function(req, res) {
			Goal.find(function(err, goals) {
				if (err) return res.send(err);

				// return the users
				res.json(goals);
			});
		})




	apiRouter.route('goals/:goal_id')


	// get a specific goal

		.get(function(req, res) {
			Goal.findById(req.params.goal_id, function(err, goal) {
				if (err) return res.send(err);

				// return that goal
				res.json(goal);
			});
		})


	// delete the goal with this id
		.delete(function(req, res) {
			Goal.remove({
				_id: req.params.goal_id
			}, function(err, goal) {
				if (err) return res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		})


	// edit the goal with this idea

		.put(function(req,res) {

			Goal.findById(req.params.goal_id, function(err, goal) {

				if (err) return res.send(err);

				if (req.body.scorer) goal.scorer = req.body.scorer;
				if (req.body.mins) goal.mins = req.body.mins;
				if (req.body.assist) goal.assist = req.body.assist;
				if (req.body.fixture) goal.fixture = req.body.fixture;

				// save the fixture
				fixture.save(function(err) {
					if (err) return res.send(err);

					// return a message
					res.json({ message: 'goal updated!' });
				});
			})

		});



	return apiRouter

	}


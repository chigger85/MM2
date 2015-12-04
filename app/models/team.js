
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var teamSchema = new Schema({

	name: String,
	season: {year: {date: String,
					won: Number,
					drawn: Number,
					lost: Number}
			},
	venue: String,
	players: [{type: Schema.Types.ObjectId, ref: 'User' }]






})

module.exports = mongoose.model('Team', teamSchema);



























module.exports = mongoose.model('Fixture', FixtureSchema);
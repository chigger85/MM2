
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var leagueSchema = new Schema({

	name: String,
	teams: [{type: Schema.Types.ObjectId, ref: 'Team' }]






})

module.exports = mongoose.model('league', leagueSchema);



























module.exports = mongoose.model('Fixture', FixtureSchema);
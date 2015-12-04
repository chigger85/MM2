
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var FixtureSchema = new Schema({

	opposition: {type: Schema.Types.ObjectId, ref: 'Team' },
	venue: String,
	date: {type: Date, default: Date.now, index: { unique: true }},
	home: {type: Boolean}, 
	ko: String,
	comp: String,
	available: [{type: Schema.Types.ObjectId, ref: 'User' }],
	matchStats: {

		homeGoals: Number,
		awayGoals: Number,
		goal: [{ type: Schema.Types.ObjectId, ref: 'Goal' }],
		yellow: [{type: Schema.Types.ObjectId, ref: 'User' }],
		red: [{type: Schema.Types.ObjectId, ref: 'User' }],
		motm: {type: Schema.Types.ObjectId, ref: 'User' },
		dotd: {type: Schema.Types.ObjectId, ref: 'User' },
		starter: [{type: Schema.Types.ObjectId, ref: 'User' }],
		subs: [{type: Schema.Types.ObjectId, ref: 'User' }],



	
	},

	status: String,
	paid:[{type: Schema.Types.ObjectId, ref: 'User' }],
	kit: {type: Schema.Types.ObjectId, ref: 'User' },

});


FixtureSchema.methods.findUpcoming = function(cb) {

	return this.find( {"date":{ "$gt": Date.now}}, cb

	);
};

FixtureSchema.methods.findResults = function(cb) {

	return this.find({"date":{ "$lt": Date.now}}, cb

	);
};



module.exports = mongoose.model('Fixture', FixtureSchema);
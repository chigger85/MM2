
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var GoalSchema = new Schema({

	scorer: { type: Schema.Types.ObjectId, ref: 'User' },
	mins: Number,	
	assist: { type: Schema.Types.ObjectId, ref: 'User' },
	fixture: { type: Schema.Types.ObjectId, ref: 'Fixture' }

})


module.exports = mongoose.model('Goal', GoalSchema);


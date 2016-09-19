var mongoose = require('mongoose');

var Post = new mongoose.Schema({
	postedByProfileId: String,
	postedByFullName: String,
	postedByProfilePic: String,
	postedByEmail: String,
	postedDate: {type: Date, default: Date.now},
	classID: String,
	professor: String,
	postMessage: String
});

module.exports = mongoose.model('Post', Post);
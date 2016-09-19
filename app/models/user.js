var Mongoose = require('mongoose');
var userSchema = new Mongoose.Schema({
	profileID: String,
	fullName: String,
	profilePic: String,
	email: String,
	token: String
});

module.exports = Mongoose.model('User', userSchema);
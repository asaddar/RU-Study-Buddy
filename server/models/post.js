const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    datePosted: { type: Date, default: Date.now },
    message: String,
    author: { type : mongoose.Schema.ObjectId, ref: 'user' },
    professor: String,
    courseId: String,
    connectedUsers: []
});

const ModelClass = mongoose.model('post', postSchema);

module.exports = ModelClass;